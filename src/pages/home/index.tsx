import c from "classnames";
import s from "./index.module.less";
import Soil from "@/components/Soil";
import Package from "@/components/Package";

const Home = () => {
  return (
    <div className={c(s.home, "relative fbv fbac fbjc")}>
      <Package />
      <Soil />
    </div>
  );
};

export default Home;
