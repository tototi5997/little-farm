import { ModalProps } from "antd";
import StoreModal from "./contents/StoreModal";
import SellModal from "./contents/SellModal";

interface IModalMain {
  des?: string;
  component: (props: unknown) => JSX.Element | null;
  extraProps?: Record<string, unknown>;
  noPadding?: boolean;
}

export type GlobalMoalType = IModalMain & ModalProps;

export type ModalKey = "store_modal" | "sell_modal";

const modalMap = new Map<ModalKey, GlobalMoalType>([
  [
    "store_modal",
    {
      component: StoreModal,
      footer: null,
      noPadding: true,
      closable: false,
      maskClosable: false,
      width: 600,
    },
  ],
  [
    "sell_modal",
    {
      component: SellModal,
      footer: null,
      noPadding: true,
      closable: false,
      maskClosable: false,
      width: 600,
    },
  ],
]);

export default modalMap;
