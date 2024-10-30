import c from "classnames";
import s from "./index.module.less";
import Soil from "@/components/Soil";
import Package from "@/components/Package";
import Radio from "@/components/Radio";
import NpcBlock from "@/components/NpcBlock";
import useModal from "@/hooks/useModal";

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
      <div className={c(s.npc_content, "fbv fbac")}>
        <NpcBlock iconName="icon-store" label="商店" onClick={handleClickStore} />
      </div>
    </div>
  );
};

export default Home;
