import { Children } from "react";
import c from "classnames";
import s from "./index.module.less";

export enum SolidStatus {
  UN_DEVELOPED,
  DEVELOPED,
}

const Soil = () => {
  const solid_status = [
    {
      id: 1,
      status: SolidStatus.DEVELOPED,
      plants: {
        id: "001",
        code: 1,
        name: "土豆",
        iconName: "icon-tudou",
        // status: PlantStatus.NOT_GERMINATED,
        both_time: 1729842776556,
        growth_cycle: 40 * 60 * 1000, // 用于计算当前状态
      },
    },
    ...new Array(15).fill(0).map((_, index) => ({
      id: index + 2,
      status: SolidStatus.UN_DEVELOPED,
    })),
  ];
  const renderSolidBlock = () => {
    return solid_status.map((sol) =>
      Children.toArray(
        <div
          className={c(s.solid_block, {
            [s.un_developed]: sol.status === SolidStatus.UN_DEVELOPED,
          })}
        ></div>
      )
    );
  };
  return <div className={c(s.soil)}>{renderSolidBlock()}</div>;
};

export default Soil;
