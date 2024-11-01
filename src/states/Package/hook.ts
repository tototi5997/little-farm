import { PlantsType } from "@/plants/Plants";
import { useAppDispatch, useAppState } from "..";
import { Seed, setBalance, setHarvest, setSeeds, setSelectedTool, TypeHarvest } from "./reducer";
import { cloneDeep } from "lodash-es";

export const useSeeds = () => {
  const seeds = useAppState((state) => state.package.seeds);
  const dispatch = useAppDispatch();

  // 选中种子
  const selectSeed = (seed: Seed) => {
    dispatch(setSelectedTool(seed));
  };

  // 播种，每次消耗种子数为 1
  const plantSeed = (seed: Seed) => {
    // 种子数量 - 1
    const newSeeds = seeds.map((item) => {
      if (item.type === seed.type)
        return {
          ...item,
          num: item.num - 1,
        };
      return item;
    });

    dispatch(setSeeds(newSeeds));
  };

  // 收获新的种子
  const getNewSeeds = (receivedSeeds: { type: PlantsType; num: number; name: string }[]) => {
    // 遍历目前的种子
    // 如果种子类型和收到的种子类型相同，则数量加上收到的数量
    // 如果种子类型和收到的种子类型不相同，则是新的种子
    const seedsNewReceived: Seed[] = [];
    let copySeeds = cloneDeep(seeds);

    receivedSeeds.forEach((n) => {
      const received = copySeeds.find((r) => r.type === n.type);
      if (received) {
        received.num += n.num;
      } else {
        seedsNewReceived.push({
          name: n.name,
          type: n.type,
          icon_name: `icon-${n.type}`,
          num: n.num,
          is_seed: true,
        });
      }
    });

    copySeeds = copySeeds.concat(seedsNewReceived);
    dispatch(setSeeds(copySeeds));
  };

  return { seeds, selectSeed, plantSeed, getNewSeeds };
};

// 获取收获的植物
export const useHarvest = () => {
  const harvest = useAppState((state) => state.package.harvest);
  const dispatch = useAppDispatch();

  // 收获植物，一次收获一种植物
  const getHarvest = (newHarvest: { type: PlantsType; num: number; name: string }) => {
    const harvestNewReceived: TypeHarvest[] = [];
    const copyHarvest = cloneDeep(harvest);

    const harvestReceived = copyHarvest.find((h) => h.type === newHarvest.type);
    if (harvestReceived) {
      harvestReceived.num += newHarvest.num;
    } else {
      harvestNewReceived.push({
        type: newHarvest.type,
        num: newHarvest.num,
        name: newHarvest.name,
        is_harvest: true,
      });
    }

    copyHarvest.push(...harvestNewReceived);
    dispatch(setHarvest(copyHarvest));
  };

  return { harvest, getHarvest };
};

// 选择工具
export const useSelectedTool = () => {
  const selected_tool = useAppState((state) => state.package.selected_tool);
  const is_seed = (selected_tool as Seed)?.is_seed || false;
  const is_hoe = selected_tool === "hoe";

  const dispatch = useAppDispatch();

  const selectHoe = () => dispatch(setSelectedTool("hoe"));

  const selectNone = () => dispatch(setSelectedTool("none"));

  return { selected_tool, is_seed, is_hoe, selectHoe, selectNone };
};

export const useFertilizers = () => {
  const fertilizers = useAppState((state) => state.package.fertilizers);

  const dispatch = useAppDispatch();
  const selectFertilizer = (tool: "none" | "fertilizer") => {
    dispatch(setSelectedTool(tool));
  };
  return { fertilizers, selectFertilizer };
};

export const useBalance = () => {
  const balance = useAppState((state) => state.package.balance);
  const dispatch = useAppDispatch();

  const updateBalance = (balance: number) => {
    dispatch(setBalance(balance));
  };

  const costBalance = (cost: number) => {
    if (balance >= cost) {
      const newBalance = balance - cost;
      dispatch(setBalance(newBalance));
    }
  };

  return { balance, costBalance, updateBalance };
};
