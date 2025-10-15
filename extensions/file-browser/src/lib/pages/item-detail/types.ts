import type { ReactNode } from "react";
import type { MdItem } from "$lib/types";

export type ItemDetailProps = {
  entry: MdItem;
  directoryTarget?: ReactNode;
};
