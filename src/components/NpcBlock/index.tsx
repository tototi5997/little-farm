import Icon from "../icon";
import c from "classnames";
import s from "./index.module.less";

interface INpcBlock {
  iconName: string;
  className?: string;
  label: string;
  onClick?: () => void;
}

const NpcBlock: React.FC<INpcBlock> = (props) => {
  const { iconName, className, label, onClick } = props;

  return (
    <div className={c(s.npc_block, className, "hand usn fbv fbac fbjc gap-10")} onClick={() => onClick?.()}>
      <Icon name={iconName} size={40} />
      <div>{label}</div>
    </div>
  );
};

export default NpcBlock;
