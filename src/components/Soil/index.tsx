import { Children, useEffect, useState } from "react";
import { getPlantsInstance, PlantStatus, PlantsType } from "@/plants/Plants";
import { useSoilConfig } from "@/states/Soil/hook";
import { useBalance, useHarvest, useSeeds, useSelectedTool } from "@/states/Package/hook";
import { Seed } from "@/states/Package/reducer";
import { useEvents } from "@/states/Events/hook";
import { RadioEventType } from "@/states/Events/reducer";
import { soil_develop_cost, soil_upgrade_cost } from "@/constants";
import { debounce } from "lodash-es";
import { useFarm } from "@/states/Account/hook";
import Icon from "../icon";
import dayjs from "dayjs";
import c from "classnames";
import s from "./index.module.less";

export enum SoilStatus {
  UN_DEVELOPED,
  DEVELOPED,
}

export const PlantsStatusMap = {
  [PlantStatus.NOT_GERMINATED]: "未发芽",
  [PlantStatus.GERMINATING]: "发芽",
  [PlantStatus.MATURE]: "成熟",
  [PlantStatus.DEATH]: "枯萎",
};

export type Soil = {
  id: number;
  status: SoilStatus;
  current_solid_grade?: number;
  plants?: {
    type: PlantsType;
    both_time: number;
  };
};

export type LandConfig = {
  id: number;
  status: SoilStatus;
  current_solid_grade?: number;
  plants?: {
    type: PlantsType;
    name: string;
    icon_name?: string;
    both_time: number;
    status: PlantStatus;
  };
};

const Soil = () => {
  const [landConfig, setLandConfig] = useState<LandConfig[]>([]);

  const { seeds, plantSeed, getNewSeeds } = useSeeds();

  const { solidConfig, solidConfigNeighbor, is_owner, updateSoilConfig } = useSoilConfig();

  const currentSolidConfig = is_owner ? solidConfig : solidConfigNeighbor;

  const { is_seed, is_hoe, selected_tool, selectNone } = useSelectedTool();

  const { balance, costBalance } = useBalance();

  const { currentFarm, backToMyFarm } = useFarm();

  const { getHarvest } = useHarvest();

  const { addNewEvent } = useEvents();

  useEffect(() => {
    const initializeLandConfig = async () => {
      const initLandConfig = await Promise.all(
        currentSolidConfig.map(async (sol: Soil) => {
          if (sol.status === SoilStatus.DEVELOPED && sol.plants) {
            const plantInstance = await getPlantsInstance({
              type: sol.plants.type,
              data: {
                both_time: sol.plants?.both_time,
                current_solid_grade: sol.current_solid_grade!,
              },
            });
            return {
              ...sol,
              plants: {
                type: sol.plants.type,
                name: plantInstance.name,
                icon_name: plantInstance.icon_name,
                both_time: plantInstance.both_time,
                status: plantInstance.status,
              },
            };
          }
          return {
            ...sol,
            plants: undefined,
          };
        })
      );
      setLandConfig(initLandConfig);
    };

    const updateTimer = setInterval(() => {
      initializeLandConfig();
    }, 1000);

    initializeLandConfig();

    return () => {
      clearInterval(updateTimer);
    };
  }, [currentSolidConfig]);

  // 播种
  const plantAction = (soilIndex: number) => {
    const selected_seed = selected_tool as Seed;
    const seed_num_in_package = seeds.find((seed) => seed.type === selected_seed.type)?.num;

    if (seed_num_in_package! <= 0) {
      document.body.style.cursor = "auto";
      return selectNone();
    }

    const newPlant = {
      type: selected_seed?.type,
      both_time: dayjs().unix(),
    };

    const initConfig = [...solidConfig];

    initConfig[soilIndex] = {
      ...initConfig[soilIndex],
      plants: newPlant,
    };

    updateSoilConfig(initConfig);
    plantSeed(selected_seed);
  };

  // 使用铲子: 铲除/开垦/升级土地
  const hoeAction = (land: LandConfig, index: number) => {
    // 空地
    if (land.status === SoilStatus.UN_DEVELOPED) {
      // 计算所需金额
      const develop_fee = soil_develop_cost[index];

      if (develop_fee > balance) {
        return addNewEvent({
          type: RadioEventType.HARVEST,
          content: "你的余额不足，无法开发空地",
        });
      }

      // 开发空地
      const initConfig = [...solidConfig];
      initConfig[index] = {
        ...initConfig[index],
        status: SoilStatus.DEVELOPED,
        current_solid_grade: 1,
      };

      updateSoilConfig(initConfig);
      costBalance(develop_fee);
    }

    // 升级土地
    if (land.status === SoilStatus.DEVELOPED && !land.plants) {
      const upgrade_fee = soil_upgrade_cost[index];

      if (upgrade_fee > balance) {
        return addNewEvent({
          type: RadioEventType.HARVEST,
          content: "你的余额不足，无法升级土地",
        });
      }

      const initConfig = [...solidConfig];
      initConfig[index] = {
        ...initConfig[index],
        current_solid_grade: initConfig[index].current_solid_grade! + 1,
      };

      updateSoilConfig(initConfig);
      costBalance(upgrade_fee);
    }

    // 植物
    if (land.status === SoilStatus.DEVELOPED && land.plants) {
      // 铲除植物
      const initConfig = [...solidConfig];
      initConfig[index] = {
        ...initConfig[index],
        plants: undefined,
      };
      updateSoilConfig(initConfig);
    }
  };

  const harvestAction = async (land: LandConfig, index: number) => {
    const landPlant = land.plants!;
    const plantInstance = await getPlantsInstance({
      type: landPlant.type,
      data: {
        both_time: landPlant.both_time,
        current_solid_grade: land.current_solid_grade!,
      },
    });

    const output = plantInstance.harvest();

    // 可以收获的阶段
    if (plantInstance.status === PlantStatus.MATURE || plantInstance.status === PlantStatus.DEATH) {
      // 更新土地信息
      const initConfig = [...solidConfig];

      initConfig[index] = {
        ...initConfig[index],
        plants: undefined,
      };

      updateSoilConfig(initConfig);

      // 更新收获植物
      if (output.output) {
        getHarvest({ type: landPlant.type, num: output.output, name: landPlant.name });
      }

      // 更新收获的种子数
      if (output.seeds) {
        getNewSeeds([{ type: landPlant.type, num: output.seeds, name: landPlant.name }]);
      }

      addNewEvent({
        type: RadioEventType.HARVEST,
        content: `收获 ${plantInstance.name} * ${output?.output}, 种子 * ${output?.seeds} `,
      });
    } else {
      addNewEvent({
        type: RadioEventType.HARVEST,
        content: `${output?.error}`,
      });
    }
  };

  const harvestStealAction = (land: LandConfig, index: number) => {
    // 判断当前土地被偷次数是否超过5次，超过5次则不能偷
    // 小于5次，偷取随机个数的果实
    // 更新自己背包中的收获数据
    // 更新目标土地的次数，被偷次数+1，来访记录添加偷取记录
  };

  const handleClickSoilBlock = debounce(
    (land: LandConfig, index: number) => {
      if (is_owner) {
        // 播种模式
        if (land.status === SoilStatus.DEVELOPED && !land.plants && is_seed) return plantAction(index);

        // 铲子模式
        if (is_hoe) return hoeAction(land, index);

        // 收获模式
        if (!is_hoe && !is_seed && land.status === SoilStatus.DEVELOPED && land.plants) return harvestAction(land, index);
      } else {
        if (!is_hoe && !is_seed && land.status === SoilStatus.DEVELOPED && land.plants) return harvestStealAction(land, index);
      }
    },
    1000,
    { leading: true }
  );

  const renderSoilBlock = () => {
    return landConfig.map((land: LandConfig, index) => {
      return Children.toArray(
        <div
          className={c(s.solid_block, "fbv fbac fbjc usn", {
            [s.un_developed]: land.status === SoilStatus.UN_DEVELOPED,
          })}
          onClick={() => handleClickSoilBlock(land, index)}
        >
          <Icon name={land?.plants?.icon_name as string} />
          <div>{land?.plants && PlantsStatusMap?.[land?.plants.status]}</div>
        </div>
      );
    });
  };

  return (
    <div className="fbv fbac">
      <div>{currentFarm.name}的农场</div>
      <div className={c(s.soil)}>{renderSoilBlock()}</div>
      {!is_owner && (
        <div className="hand usn mt-10" onClick={backToMyFarm}>
          返回我的农场
        </div>
      )}
    </div>
  );
};

export default Soil;
