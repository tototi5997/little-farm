import { Children } from "react";
import Icon from "../icon";
import SeedsPointer from "@/assets/seed.png";
import HoePointer from "@/assets/hoe.png";
import { useSeeds, useSelectedTool } from "@/states/Package/hook";
import { Seed } from "@/states/Package/reducer";
import c from "classnames";
import s from "./index.module.less";

const Package = () => {
  const { seeds, selectSeed } = useSeeds();

  const { selectNone, selectHoe } = useSelectedTool();

  const handleClickNoSelect = () => {
    document.body.style.cursor = "auto";
    selectNone();
  };

  const handleClickHoe = () => {
    document.body.style.cursor = `url(${HoePointer}), default`;
    selectHoe();
  };

  const renderSeeds = () => {
    const handleClickSeedItem = (item: Seed) => {
      document.body.style.cursor = `url(${SeedsPointer}), default`;
      if (item.num > 0) selectSeed(item);
    };

    return seeds.map((item) => {
      return Children.toArray(
        <div className={c(s.package_item, s.not_last, "fbh fbjc fbac hand")} onClick={() => handleClickSeedItem(item)}>
          <Icon name={item.icon_name!} />
          <div>{item.num}</div>
        </div>
      );
    });
  };

  return (
    <div className={c(s.package, "fbh fbjsb")}>
      <div className={c("fbh", s.seeds_area)}>{renderSeeds()}</div>
      <div className="fbh">
        <div className={c(s.hoe)} onClick={handleClickHoe}></div>
        <div className={c(s.no_select, "fbh fbac fbjc")} onClick={handleClickNoSelect}>
          <Icon name="no-select" />
        </div>
      </div>
    </div>
  );
};

export default Package;
