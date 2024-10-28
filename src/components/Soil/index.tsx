import { Children, useEffect, useRef, useState } from "react";
import { getPlantsInstance, PlantStatus } from "@/plants/Plants";
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
    type: string;
    both_time: number;
  };
};

export type LandConfig = {
  id: number;
  status: SolidStatus;
  current_solid_grade?: number;
  plants?: {
    type: string;
    name: string;
    icon_name?: string;
    both_time: number;
    status: PlantStatus;
  };
};

// 数据库中读取的数据
const initSolidConfig = [
  {
    id: 1,
    status: SolidStatus.DEVELOPED,
    current_solid_grade: 0,
    plants: {
      type: "cabbage",
      both_time: dayjs("2024-10-28 16:00").unix(),
    },
  },
  {
    id: 2,
    status: SolidStatus.DEVELOPED,
    current_solid_grade: 0,
  },
  ...new Array(14).fill(0).map((_, index) => ({
    id: index + 2,
    status: SolidStatus.UN_DEVELOPED,
  })),
];

const Soil = () => {
  const [landConfig, setLandConfig] = useState<LandConfig[]>([]);
  const solidConfig = useRef<Solid[]>(initSolidConfig);

  useEffect(() => {
    const initializeLandConfig = async () => {
      const initLandConfig = await Promise.all(
        solidConfig.current.map(async (sol: Solid) => {
          if (sol.status === SolidStatus.DEVELOPED && sol.plants) {
            const plantInstance = await getPlantsInstance({
              type: "cabbage",
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

  const handleClickSolidBlock = async (land: LandConfig, index: number) => {
    document.body.style.cursor = "auto";

    if (land.status === SolidStatus.DEVELOPED && !land.plants) {
      const newPlant = {
        type: "cabbage",
        both_time: dayjs().unix(),
      };
      const initConfig = [...initSolidConfig];

      initConfig[index] = {
        ...initConfig[index],
        plants: newPlant,
      };

      solidConfig.current = initConfig;
    }
  };

  const renderSolidBlock = () => {
    return landConfig.map((land: LandConfig, index) => {
      return Children.toArray(
        <div
          className={c(s.solid_block, "fbv fbac fbjc", {
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
