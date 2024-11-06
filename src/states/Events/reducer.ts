import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum RadioEventType {
  TOOLTIP,
  HARVEST,
  STEAL,
  SELL,
}

export type RadioEvent = {
  type: RadioEventType;
  content: string;
};

export interface EventsState {
  eventsList: RadioEvent[];
}

const initialState: EventsState = {
  eventsList: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<RadioEvent>) => {
      state.eventsList.push(action.payload);
    },
    updateEvents: (state, action: PayloadAction<RadioEvent[]>) => {
      state.eventsList = action.payload;
    },
  },
});

export const { addEvent, updateEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
