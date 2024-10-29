import c from "classnames";
import s from "./index.module.less";
import Soil from "@/components/Soil";
import Package from "@/components/Package";
import Radio from "@/components/Radio";

const Home = () => {
  return (
    <div className={c(s.home, "relative fbv fbac fbjc")}>
      <Package />
      <Radio />
      <Soil />
    </div>
  );
};

export default Home;
