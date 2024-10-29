import c from "classnames";
import s from "./index.module.less";

export enum RadioEventType {
  TOOLTIP,
  HARVEST,
  STEAL,
}

export type RadioEvent = {
  type: RadioEventType;
  content: string;
};

// 信息缓存
const events: RadioEvent[] = [
  {
    type: RadioEventType.TOOLTIP,
    content: "提示信息",
  },
];

export const Radio = () => {
  return <div className={c(s.radio)}></div>;
};

export default Radio;
