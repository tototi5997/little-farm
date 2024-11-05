import { Children, useState } from "react";
import Icon from "../icon";
import SeedsPointer from "@/assets/seed.png";
import HoePointer from "@/assets/hoe.png";
import { useBalance, useHarvest, useSeeds, useSelectedTool } from "@/states/Package/hook";
import { Seed } from "@/states/Package/reducer";
import c from "classnames";
import s from "./index.module.less";

const packageTabs: { name: string; key: "seed_tab" | "harvest_tab" | "pet_tab" }[] = [
  {
    name: "种子",
    key: "seed_tab",
  },
  {
    name: "果实",
    key: "harvest_tab",
  },
  {
    name: "宠物",
    key: "pet_tab",
  },
];

const Package = () => {
  const { seeds, selectSeed } = useSeeds();

  const { harvest } = useHarvest();

  const { balance } = useBalance();

  const [activeTab, setActiveTabs] = useState<"seed_tab" | "harvest_tab" | "pet_tab">("seed_tab");

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
      if (item.num === 0) return null;
      return Children.toArray(
        <div className={c(s.package_item, "fbh fbjc fbac hand")} onClick={() => handleClickSeedItem(item)}>
          <Icon name={item.icon_name!} />
          <div className="text-[12px]">{item.num}</div>
        </div>
      );
    });
  };

  const renderHarvest = () => {
    return harvest.map((h) => {
      if (h.num === 0) return null;
      return Children.toArray(
        <div className={c(s.package_item, "fbv fbjc fbac hand")}>
          <Icon name={`icon-${h.type}`} />
          <div className="text-[12px]">
            {h.name} * {h.num}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={c(s.package, "fbh fbjsb fbac")}>
      <div className={c(s.package_tabs, "absolute fbv gap-2")}>
        {packageTabs.map((tab) =>
          Children.toArray(
            <div className={c(s.tab_item, "hand usn", { [s.active]: tab.key === activeTab })} onClick={() => setActiveTabs(tab.key)}>
              {tab.name}
            </div>
          )
        )}
      </div>

      {activeTab === "seed_tab" && <div className={c("fbh", s.seeds_area)}>{renderSeeds()}</div>}
      {activeTab === "harvest_tab" && <div className={c("fbh", s.seeds_area)}>{renderHarvest()}</div>}
      {activeTab === "pet_tab" && <div className={c("fbh", s.seeds_area)}></div>}

      <div>余额: {balance}</div>

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
