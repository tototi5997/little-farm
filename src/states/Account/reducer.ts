import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TypeNeighbor = {
  name: string;
  id: string;
};

export type AccountState = {
  userName: string;
  accountId: string;
  neigbhors: TypeNeighbor[];
  current_farm: TypeNeighbor;
};

const neighborData: TypeNeighbor[] = [
  { id: "0x123457", name: "大山" },
  { id: "0x123459", name: "小玉" },
];

const initialState: AccountState = {
  userName: "江伟",
  accountId: "0x123456",
  neigbhors: neighborData,
  current_farm: { name: "江伟", id: "0x123456" }, // 登录成功默认设置为主人
};

const neighborSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentFarm: (state, action: PayloadAction<TypeNeighbor>) => {
      state.current_farm = action.payload;
    },
  },
});

export default neighborSlice.reducer;
export const { setCurrentFarm } = neighborSlice.actions;
