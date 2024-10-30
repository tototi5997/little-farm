import { Children, useEffect, useState } from "react";
import { getPlantsInstance, PlantStatus, PlantsType } from "@/plants/Plants";
import { useSolidConfig } from "@/states/Solid/hook";
import { useSeeds, useSelectedTool } from "@/states/Package/hook";
import { Seed } from "@/states/Package/reducer";
import { useEvents } from "@/states/Events/hook";
import { RadioEventType } from "@/states/Events/reducer";
import { debounce } from "lodash-es";
import Icon from "../icon";
import dayjs from "dayjs";
import c from "classnames";
import s from "./index.module.less";

export enum SolidStatus {
  UN_DEVELOPED,
  DEVELOPED,
}

export const PlantsStatusMap = {
  [PlantStatus.NOT_GERMINATED]: "未发芽",
  [PlantStatus.GERMINATING]: "发芽",
  [PlantStatus.MATURE]: "成熟",
  [PlantStatus.DEATH]: "枯萎",
};

export type Solid = {
  id: number;
  status: SolidStatus;
  current_solid_grade?: number;
  plants?: {
    type: PlantsType;
    both_time: number;
  };
};

export type LandConfig = {
  id: number;
  status: SolidStatus;
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

  const { solidConfig, updateSolidConfig } = useSolidConfig();

  const { is_seed, is_hoe, selected_tool, selectNone } = useSelectedTool();

  const { addNewEvent } = useEvents();

  useEffect(() => {
    const initializeLandConfig = async () => {
      const initLandConfig = await Promise.all(
        solidConfig.map(async (sol: Solid) => {
          if (sol.status === SolidStatus.DEVELOPED && sol.plants) {
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

  const handleClickSolidBlock = debounce(
    async (land: LandConfig, index: number) => {
      // 播种模式
      if (land.status === SolidStatus.DEVELOPED && !land.plants && is_seed) {
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

        updateSolidConfig(initConfig);
        plantSeed(selected_seed);
        // document.body.style.cursor = "auto";
      }

      // 铲子模式
      if (is_hoe) {
        // 空地
        if (land.status === SolidStatus.UN_DEVELOPED) {
          // 开发空地
          const initConfig = [...solidConfig];
          initConfig[index] = {
            ...initConfig[index],
            status: SolidStatus.DEVELOPED,
          };
          updateSolidConfig(initConfig);
        }

        // 植物
        if (land.status === SolidStatus.DEVELOPED && land.plants) {
          // 铲除植物
          const initConfig = [...solidConfig];
          initConfig[index] = {
            ...initConfig[index],
            plants: undefined,
          };
          updateSolidConfig(initConfig);
        }
      }

      // 收获模式
      if (!is_hoe && !is_seed && land.status === SolidStatus.DEVELOPED && land.plants) {
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

          updateSolidConfig(initConfig);

          // 更新背包信息
          // todo 存储收获的果实

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

  const renderSolidBlock = () => {
    return landConfig.map((land: LandConfig, index) => {
      return Children.toArray(
        <div
          className={c(s.solid_block, "fbv fbac fbjc usn", {
            [s.un_developed]: land.status === SolidStatus.UN_DEVELOPED,
          })}
          onClick={() => handleClickSolidBlock(land, index)}
        >
          <Icon name={land?.plants?.icon_name as string} />
          <div>{land?.plants && PlantsStatusMap?.[land?.plants.status]}</div>
        </div>
      );
    });
  };

  return <div className={c(s.soil)}>{renderSolidBlock()}</div>;
};

export default Soil;
