import { ModalProps } from "antd";
import StoreModal from "./contents/StoreModal";

interface IModalMain {
  des?: string;
  component: (props: unknown) => JSX.Element | null;
  extraProps?: Record<string, unknown>;
  noPadding?: boolean;
}

export type GlobalMoalType = IModalMain & ModalProps;

export type ModalKey = "store_modal";

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
]);

export default modalMap;
