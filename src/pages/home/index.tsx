import c from "classnames";
import s from "./index.module.less";
import Soil from "@/components/Soil";

const Home = () => {
  return (
    <div className={c(s.home, "relative fbv fbac fbjc")}>
      <Soil />
    </div>
  );
};

export default Home;
