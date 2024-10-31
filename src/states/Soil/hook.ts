import { useAppDispatch, useAppState } from "..";
import { setSoilConfig } from "./reducer";
import { Soil } from "@/components/Soil";

export const useSoilConfig = () => {
  const solidConfig = useAppState((state) => state.solid.solid_config);
  const is_owner = useAppState((state) => state.solid.is_owner);
  const dispatch = useAppDispatch();

  const updateSoilConfig = (config: Soil[]) => {
    if (is_owner) {
      dispatch(setSoilConfig(config));
    }
  };

  return { solidConfig, updateSoilConfig };
};
