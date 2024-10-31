import { Children, useEffect, useState } from "react";
import { getPlantsInstance, PlantStatus, PlantsType } from "@/plants/Plants";
import { useSoilConfig } from "@/states/Soil/hook";
import { useHarvest, useSeeds, useSelectedTool } from "@/states/Package/hook";
import { Seed } from "@/states/Package/reducer";
import { useEvents } from "@/states/Events/hook";
import { RadioEventType } from "@/states/Events/reducer";
import { debounce } from "lodash-es";
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

  const { seeds, plantSeed } = useSeeds();

  const { solidConfig, updateSoilConfig } = useSoilConfig();

  const { is_seed, is_hoe, selected_tool, selectNone } = useSelectedTool();

  const { getHarvest } = useHarvest();

  const { addNewEvent } = useEvents();

  useEffect(() => {
    const initializeLandConfig = async () => {
      const initLandConfig = await Promise.all(
        solidConfig.map(async (sol: Soil) => {
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
  }, [solidConfig]);

  const handleClickSoilBlock = debounce(
    async (land: LandConfig, index: number) => {
      // 播种模式
      if (land.status === SoilStatus.DEVELOPED && !land.plants && is_seed) {
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

        initConfig[index] = {
          ...initConfig[index],
          plants: newPlant,
        };

        updateSoilConfig(initConfig);
        plantSeed(selected_seed);
        // document.body.style.cursor = "auto";
      }

      // 铲子模式
      if (is_hoe) {
        // 空地
        if (land.status === SoilStatus.UN_DEVELOPED) {
          // 开发空地
          const initConfig = [...solidConfig];
          initConfig[index] = {
            ...initConfig[index],
            status: SoilStatus.DEVELOPED,
          };
          updateSoilConfig(initConfig);
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
      }

      // 收获模式
      if (!is_hoe && !is_seed && land.status === SoilStatus.DEVELOPED && land.plants) {
        const landPlant = land.plants;
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
          // todo 更新收获的植物种子

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

  return <div className={c(s.soil)}>{renderSoilBlock()}</div>;
};

export default Soil;
