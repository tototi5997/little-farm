import React from "react";
import { TypeNeighbor } from "@/states/Account/reducer";
import c from "classnames";
import s from "./index.module.less";

export interface INeighborItem {
  className?: string;
  onClick?: () => void;
  data: TypeNeighbor;
  isActive?: boolean;
}

export const NeighborItem: React.FC<INeighborItem> = ({ className, onClick, data, isActive }) => {
  const { name } = data;
  return (
    <div className={c(s.neighbor_item, className, "hand fbh fbac")} onClick={() => onClick?.()}>
      <div>{name}</div>
      {isActive && <div className={c(s.active, "ml-auto")} />}
    </div>
  );
};

export default NeighborItem;
