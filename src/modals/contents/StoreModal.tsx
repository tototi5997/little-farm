import { Children, useState } from "react";
import IconButton from "@/components/iconButton";
import useModal from "@/hooks/useModal";
import { seeds_sell } from "@/constants";
import { Button, InputNumber, message } from "antd";
import { useBalance, useSeeds } from "@/states/Package/hook";
import { useEvents } from "@/states/Events/hook";
import { RadioEventType } from "@/states/Events/reducer";
import s from "./index.module.less";
import c from "classnames";
import { PlantsType } from "@/plants/Plants";

export type GoodsType = "seed" | "fertilizer" | "pet";

export type BillType = {
  key: string;
  name: string;
  price: number;
  num: number;
};

const StoreModal = () => {
  const modal = useModal();

  const [activeTab, setActiveTab] = useState<GoodsType>("seed");
  const [bills, setBills] = useState<BillType[]>([]);

  const { balance, updateBalance } = useBalance();

  const { getNewSeeds } = useSeeds();

  const { addNewEvent } = useEvents();

  const goodsCategory: { label: string; key: GoodsType }[] = [
    { label: "种子", key: "seed" },
    { label: "肥料", key: "fertilizer" },
    { label: "宠物", key: "pet" },
  ];

  const changeBill = (good: any, val: number) => {
    const index = bills.findIndex((bill) => bill.key === good.key);
    if (index !== -1) {
      const newBills = [...bills];
      newBills[index].num = val;
      setBills(newBills);
    } else {
      setBills([...bills, { key: good.key, name: good.name, price: good.price, num: val }]);
    }
  };

  const handleFinishBills = () => {
    const totoalPay = bills.reduce((a, b) => a + b.price * b.num, 0);
    if (balance < totoalPay) return message.error("余额不足");

    modal?.hide();
    const resetBalance = balance - totoalPay;
    updateBalance(resetBalance);

    const eventInfo = bills.reduce((a, b) => a + `${b.name} * ${b.num} `, "你获得了：");
    addNewEvent({
      type: RadioEventType.TOOLTIP,
      content: eventInfo,
    });

    // 更新背包中的种子
    bills.forEach((bill) => {
      getNewSeeds({ type: bill.key as PlantsType, number: bill.num });
    });

    setBills([]);
  };

  return (
    <div className={c(s.store_modal)}>
      <div className="fbh fbjsb fbac">
        <div>商店</div>
        <IconButton name="close" onClick={() => modal?.hide()} />
      </div>

      <div className="mt-20">余额: {balance}</div>

      <div className={c(s.category_content, "fbh mt-20 gap-4")}>
        {goodsCategory?.map((cat) =>
          Children.toArray(
            <div className={c(s.category_item, { [s.active]: activeTab === cat.key })} onClick={() => setActiveTab(cat.key)}>
              {cat.label}
            </div>
          )
        )}
      </div>

      <div className="mt-10">
        {activeTab === "seed" && (
          <div className={c(s.seeds_content)}>
            {seeds_sell.map((seed) => {
              const exit_seed = bills?.find((bill) => bill.key === seed.key);
              return Children.toArray(
                <div className={c(s.seeds_item, "p-10 fbh fbac")}>
                  <div>
                    <div>{seed.name}</div>
                    <div className="text-[12px]">价格: {seed.price}</div>
                  </div>
                  <div className="fbh ml-auto fbac gap-10">
                    <div>购买数量:</div>
                    <InputNumber
                      style={{ width: 50, height: 30 }}
                      defaultValue={exit_seed?.num || 0}
                      min={0}
                      max={99}
                      onChange={(val) => changeBill(seed, val!)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === "fertilizer" && <div className={c(s.fertilizer_content)}>等待上线</div>}
        {activeTab === "pet" && <div className={c(s.pet_content)}>等待上线</div>}
      </div>

      <div className="mt-20 fbh fbac fbje">
        <Button type="primary" onClick={handleFinishBills}>
          结账
        </Button>
      </div>
    </div>
  );
};

export default StoreModal;
