import { Children, useState } from "react";
import { useAccount, useFarm } from "@/states/Account/hook";
import NeighborItem from "@/components/NeighborItem";
import { TypeNeighbor } from "@/states/Account/reducer";
import { Drawer } from "antd";
import Soil from "@/components/Soil";
import Package from "@/components/Package";
import Radio from "@/components/Radio";
import NpcBlock from "@/components/NpcBlock";
import useModal from "@/hooks/useModal";
import c from "classnames";
import s from "./index.module.less";

const Home = () => {
  const [showNeighbors, setShowNeighbors] = useState(false);

  const modal = useModal();

  const { neigbhors, enterFarm, currentFarm } = useFarm();

  const { ownerId, ownerName } = useAccount();

  const handleClickStore = () => {
    modal?.show("store_modal");
  };

  const handleClickSell = () => {
    modal?.show("sell_modal");
  };

  const handleClickNeighbor = () => {
    setShowNeighbors(true);
  };

  const handleChangeFarm = (n: TypeNeighbor) => {
    enterFarm(n);
  };

  const renderNeighbors = () => {
    const neighborsData = [{ name: ownerName, id: ownerId }, ...neigbhors];
    return neighborsData.map((n) => {
      return Children.toArray(<NeighborItem data={n} onClick={() => handleChangeFarm(n)} isActive={n.id === currentFarm.id} />);
    });
  };

  return (
    <div className={c(s.home, "relative fbv fbac fbjc")}>
      <Package />
      <Radio />
      <Soil />
      <div className={c(s.npc_content, "fbh fbac gap-20")}>
        <NpcBlock iconName="icon-store" label="商店" onClick={handleClickStore} />
        <NpcBlock iconName="icon-sell" label="售卖" onClick={handleClickSell} />
        <NpcBlock iconName="icon-neighbor" label="邻居" onClick={handleClickNeighbor} />
      </div>
      <Drawer title="邻居" open={showNeighbors} onClose={() => setShowNeighbors(false)} className={c(s.neighbor_drawer)}>
        <div className="fbv gap-10">{renderNeighbors()}</div>
      </Drawer>
    </div>
  );
};

export default Home;
