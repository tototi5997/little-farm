import { Soil } from "@/components/Soil";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export interface SoilState {
  solid_config: Soil[];
  is_owner: boolean;
  solid_config_neighbor: Soil[];
}

// 数据库中读取的数据
const initSoilConfig: Soil[] = [
  {
    id: 1,
    status: 1,
    current_solid_grade: 1,
    plants: {
      type: "cabbage",
      both_time: dayjs("2024-10-28 16:00").unix(),
    },
  },
  {
    id: 2,
    status: 1,
    current_solid_grade: 1,
  },
  ...new Array(14).fill(0).map((_, index) => ({
    id: index + 2,
    status: 0,
  })),
];

const initialState: SoilState = {
  solid_config: initSoilConfig,
  is_owner: true,
  solid_config_neighbor: [],
};

const solidSlice = createSlice({
  name: "solid",
  initialState,
  reducers: {
    setSoilConfig(state, action: PayloadAction<Soil[]>) {
      state.solid_config = action.payload;
    },
    setSoilConfigNeighbor(state, action: PayloadAction<Soil[]>) {
      state.solid_config_neighbor = action.payload;
    },
    setIsOwner(state, action: PayloadAction<boolean>) {
      state.is_owner = action.payload;
    },
  },
});

export const { setSoilConfig, setIsOwner, setSoilConfigNeighbor } = solidSlice.actions;
export default solidSlice.reducer;
