import { useAppDispatch, useAppState } from "..";
import { setSolidConfig } from "./reducer";
import { Solid } from "@/components/Soil";

export const useSolidConfig = () => {
  const solidConfig = useAppState((state) => state.solid.solid_config);
  const is_owner = useAppState((state) => state.solid.is_owner);
  const dispatch = useAppDispatch();

  const updateSolidConfig = (config: Solid[]) => {
    if (is_owner) {
      dispatch(setSolidConfig(config));
    }
  };

  return { solidConfig, updateSolidConfig };
};
