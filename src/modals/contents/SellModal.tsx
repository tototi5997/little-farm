import { PlantsType } from "@/plants/Plants";
import { Children, useState } from "react";
import IconButton from "@/components/iconButton";
import { seeds_sell } from "@/constants";
import { Button, InputNumber } from "antd";
import useModal from "@/hooks/useModal";
import { useBalance, useHarvest } from "@/states/Package/hook";
import { generateDeterministicPair, selectPairFromList } from "@/utils/randomPairGenerator";
import { BillType } from "./StoreModal";
import c from "classnames";
import s from "./index.module.less";
import { useEvents } from "@/states/Events/hook";
import { RadioEventType } from "@/states/Events/reducer";

export type SellGoodType = {
  key: PlantsType;
  name: string;
  sell_price: number;
};

type GoodItemProps = {
  good: SellGoodType;
  ratio: number;
  maxNum: number;
  onChange?: (good: SellGoodType, val: number) => void;
};

const sellGoods = seeds_sell;

const SellModal = () => {
  const modal = useModal();

  const [sellBill, setSellBill] = useState<BillType[]>([]);

  const { harvest, sellHarvests } = useHarvest();

  const { balance, updateBalance } = useBalance();

  const { addNewEvent } = useEvents();

  const specilRatio = 2;
  const randomPair = generateDeterministicPair(sellGoods.length, "inputuseridxxx", new Date());
  const [specilGoods, restList] = selectPairFromList(randomPair, seeds_sell) as SellGoodType[][];

  const handleChangeBills = (good: SellGoodType, val: number) => {
    const index = sellBill.findIndex((bill) => bill.key === good.key);
    if (index !== -1) {
      const newBills = [...sellBill];
      newBills[index].num = val;
      setSellBill(newBills);
    } else {
      setSellBill([...sellBill, { key: good.key, name: good.name, price: good.sell_price, num: val }]);
    }
  };

  const handleFinishBills = () => {
    // 更新背包信息
    const totalReceive = sellBill.reduce((a, b) => a + b.price * b.num, 0);
    const newBalance = balance + totalReceive;
    updateBalance(newBalance);

    sellHarvests(sellBill.map((bill) => ({ type: bill.key as PlantsType, num: bill.num, name: bill.name, is_harvest: true })));
    modal?.hide();

    addNewEvent({
      type: RadioEventType.SELL,
      content: `您收获了 ${totalReceive} 元`,
    });
  };

  return (
    <div className={c(s.sell_modal)}>
      <div className="fbh fbjsb fbac">
        <div>出售</div>
        <IconButton name="close" onClick={() => modal?.hide()} />
      </div>

      <div className="mt-20">今日特价</div>
      <div className={c(s.specil_price, "fbh fbjsb fbac")}>
        {specilGoods.map((good) => {
          const maxNum = harvest.find((h) => h.type === good.key)?.num || 0;
          return Children.toArray(<GoodItem good={good} ratio={specilRatio} maxNum={maxNum} onChange={handleChangeBills} />);
        })}
      </div>

      <div className="mt-20">收购列表</div>
      <div className={c(s.sell_list, "fbh fbjsb fbac")}>
        {restList.map((good) => {
          const maxNum = harvest.find((h) => h.type === good.key)?.num || 0;
          return Children.toArray(<GoodItem good={good} ratio={1} maxNum={maxNum} onChange={handleChangeBills} />);
        })}
      </div>

      <div className="mt-20 fbh fbac fbje">
        <Button type="primary" onClick={handleFinishBills}>
          结账
        </Button>
      </div>
    </div>
  );
};

const GoodItem: React.FC<GoodItemProps> = ({ good, ratio, maxNum, onChange }) => {
  const { name, sell_price } = good;
  const price = sell_price * ratio;

  return (
    <div className={c(s.good_item, "p-10 fbh fbac")}>
      <div>
        <div>{name}</div>
        <div>价格：{price}</div>
      </div>
      <div className="fbh ml-auto fbac gap-10">
        <div>出售数量:</div>
        <InputNumber
          style={{ width: 70, height: 30 }}
          defaultValue={0}
          min={0}
          max={maxNum}
          onChange={(val) => onChange?.({ ...good, sell_price: price }, val || 0)}
        />
      </div>
    </div>
  );
};

export default SellModal;
