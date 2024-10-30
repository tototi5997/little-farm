import { Solid } from "@/components/Soil";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export interface SolidState {
  solid_config: Solid[];
  is_owner: boolean;
  solid_config_neighbor?: Solid[];
}

// 数据库中读取的数据
const initSolidConfig: Solid[] = [
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

const initialState: SolidState = {
  solid_config: initSolidConfig,
  is_owner: true,
};

const solidSlice = createSlice({
  name: "solid",
  initialState,
  reducers: {
    setSolidConfig(state, action: PayloadAction<Solid[]>) {
      state.solid_config = action.payload;
    },
    setSolidConfigNeighbor(state, action: PayloadAction<Solid[]>) {
      state.solid_config_neighbor = action.payload;
    },
    setIsOwner(state, action: PayloadAction<boolean>) {
      state.is_owner = action.payload;
    },
  },
});

export const { setSolidConfig, setIsOwner, setSolidConfigNeighbor } = solidSlice.actions;
export default solidSlice.reducer;
