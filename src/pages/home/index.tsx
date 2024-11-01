import Soil from "@/components/Soil";
import Package from "@/components/Package";
import Radio from "@/components/Radio";
import NpcBlock from "@/components/NpcBlock";
import useModal from "@/hooks/useModal";
import c from "classnames";
import s from "./index.module.less";

const Home = () => {
  const modal = useModal();

  const handleClickStore = () => {
    modal?.show("store_modal");
  };

  return (
    <div className={c(s.home, "relative fbv fbac fbjc")}>
      <Package />
      <Radio />
      <Soil />
      <div className={c(s.npc_content, "fbh fbac gap-20")}>
        <NpcBlock iconName="icon-store" label="商店" onClick={handleClickStore} />
        <NpcBlock iconName="icon-sell" label="售卖" onClick={handleClickStore} />
      </div>
    </div>
  );
};

export default Home;
