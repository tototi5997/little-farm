import { useAppDispatch, useAppState } from "..";
import { setIsOwner } from "../Soil/reducer";
import { setCurrentFarm, TypeNeighbor } from "./reducer";

export const useFarm = () => {
  const ownerId = useAppState((state) => state.account.accountId);
  const ownerName = useAppState((state) => state.account.userName);
  const currentFarm = useAppState((state) => state.account.current_farm);
  const neigbhors = useAppState((state) => state.account.neigbhors);

  const dispatch = useAppDispatch();

  const enterFarm = (farm: TypeNeighbor) => {
    dispatch(setCurrentFarm(farm));
    dispatch(setIsOwner(ownerId === farm.id));
  };

  const backToMyFarm = () => {
    dispatch(setCurrentFarm({ name: ownerName, id: ownerId }));
    dispatch(setIsOwner(true));
  };

  return { currentFarm, neigbhors, enterFarm, backToMyFarm };
};

export const useAccount = () => {
  const ownerName = useAppState((state) => state.account.userName);
  const ownerId = useAppState((state) => state.account.accountId);

  return { ownerId, ownerName };
};
