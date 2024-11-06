import { PlantsType } from "@/plants/Plants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Seed = {
  type: PlantsType;
  num: number;
  name: string;
  icon_name?: string;
  is_seed: boolean;
};

export type Fertilizer = {
  type: string;
  num: number;
  name: string;
  is_fertilizer: boolean;
};

export type Tool = "hoe" | Seed | "fertilizer" | "none";

export type TypeHarvest = {
  type: PlantsType;
  name: string;
  num: number;
  is_harvest: boolean;
};

export interface PackageState {
  seeds: Seed[];
  harvest: TypeHarvest[];
  fertilizers: Fertilizer[];
  selected_tool: Tool;
  selected_seed?: Seed;
  balance: number;
}

// 数据中读取背包数据
const seedsConfig: Seed[] = [
  {
    name: "白菜种子",
    type: "cabbage",
    icon_name: "icon-cabbage",
    num: 10,
    is_seed: true,
  },
  {
    name: "土豆种子",
    type: "potato",
    icon_name: "icon-potato",
    num: 10,
    is_seed: true,
  },
];

// 读取收获数据
const harvsetConfig: TypeHarvest[] = [
  {
    name: "白菜",
    type: "cabbage",
    num: 10,
    is_harvest: true,
  },
  {
    name: "土豆",
    type: "potato",
    num: 10,
    is_harvest: true,
  },
];

const initialState: PackageState = {
  seeds: seedsConfig,
  harvest: harvsetConfig,
  fertilizers: [],
  selected_tool: "none",
  selected_seed: undefined,
  balance: 100,
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setSelectedTool: (state, action: PayloadAction<Tool>) => {
      state.selected_tool = action.payload;
    },
    setSeeds: (state, action: PayloadAction<Seed[]>) => {
      state.seeds = action.payload;
    },
    setHarvest: (state, action: PayloadAction<TypeHarvest[]>) => {
      state.harvest = action.payload;
    },
    setFertilizers: (state, action: PayloadAction<Fertilizer[]>) => {
      state.fertilizers = action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
});

export const { setSelectedTool, setSeeds, setFertilizers, setBalance, setHarvest } = packageSlice.actions;
export default packageSlice.reducer;
