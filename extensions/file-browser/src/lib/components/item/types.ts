import type { ReactNode } from "react";
import type { MdItem } from "$lib/types";

export type ItemActionsProps = {
  entry: MdItem;
  directoryTarget?: ReactNode;
};

export type ItemMetadataProps = {
  entry: MdItem;
};

export type FolderTreeOptions = {
  maxDepth?: number; // depth starting at 1 for children of root
  maxNodes?: number; // total nodes budget across the tree
  skipDotfiles?: boolean;
  label?: string;
};
