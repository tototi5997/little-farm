import { useAppDispatch, useAppState } from "..";
import { addEvent, RadioEvent, updateEvents } from "./reducer";

export const useEvents = () => {
  const events = useAppState((state) => state.events.eventsList);
  const dispatch = useAppDispatch();

  const addNewEvent = (event: RadioEvent) => {
    dispatch(addEvent(event));
  };

  const updateEventsList = (events: RadioEvent[]) => {
    dispatch(updateEvents(events));
  };

  return { events, addNewEvent, updateEventsList };
};
