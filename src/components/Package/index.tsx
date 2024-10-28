import { Children } from "react";
import Icon from "../icon";
import SeedsPointer from "@/assets/seed.png";
import c from "classnames";
import s from "./index.module.less";

const Package = () => {
  const packageConfig = [
    {
      name: "白菜种子",
      type: "cabbage",
      icon: "icon-cabbage",
      num: 10,
    },
  ];

  const renderPackage = () => {
    const handleClickPackageitem = (item: any) => {
      document.body.style.cursor = `url(${SeedsPointer}), default`;
      // 使用 redux 保存当前选中的种子
    };

    return packageConfig.map((item, index) => {
      return Children.toArray(
        <div className={c(s.package_item, s.not_last, "fbv fbjc fbac hand")} onClick={() => handleClickPackageitem(item)}>
          <Icon name={item.icon} />
          <div>{item.num}</div>
        </div>
      );
    });
  };

  return <div className={c(s.package)}>{renderPackage()}</div>;
};

export default Package;
