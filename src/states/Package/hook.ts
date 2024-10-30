import { PlantsType } from "@/plants/Plants";
import { useAppDispatch, useAppState } from "..";
import { Seed, setBalance, setSeeds, setSelectedTool } from "./reducer";

export const useSeeds = () => {
  const seeds = useAppState((state) => state.package.seeds);
  const dispatch = useAppDispatch();

  const selectSeed = (seed: Seed) => {
    dispatch(setSelectedTool(seed));
  };

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

  const getNewSeeds = (seed: { type: PlantsType; number: number }) => {
    const isExit = seeds.find((item) => item.type === seed.type);
    if (isExit) {
      const newSeeds = seeds.map((item) => {
        if (item.type === seed.type)
          return {
            ...item,
            num: item.num + seed.number,
          };
        return item;
      });
      console.log(newSeeds, '???')
      dispatch(setSeeds(newSeeds));
    } else {
      dispatch(
        setSeeds([
          ...seeds,
          {
            type: seed.type,
            num: seed.number,
            name: seed.type,
            is_seed: true,
          },
        ])
      );
    }
  };

  return { seeds, selectSeed, plantSeed, getNewSeeds };
};

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
  return { balance, updateBalance };
};
