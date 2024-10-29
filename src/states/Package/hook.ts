import { useAppDispatch, useAppState } from "..";
import { Seed, setSeeds, setSelectedTool } from "./reducer";

export const useSeeds = () => {
  const seeds = useAppState((state) => state.package.seeds);
  const dispatch = useAppDispatch();

  const selectSeed = (seed: Seed) => {
    dispatch(setSelectedTool(seed));
  };

  const updateSeeds = (seed: Seed) => {
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

  return { seeds, selectSeed, updateSeeds };
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
