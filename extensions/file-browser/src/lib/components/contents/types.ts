import type { List, Grid } from "@raycast/api";
import type { ReactElement, ReactNode } from "react";
import type { MdItem, MdItemSortMode } from "$lib/types";

export type ContentsViewMode = "list" | "grid";

type ListRoot = typeof List;
type GridRoot = typeof Grid;
type ListItem = ListRoot["Item"];
type GridItem = GridRoot["Item"];
type ListDropdown = ListRoot["Dropdown"];
type GridDropdown = GridRoot["Dropdown"];

export type ContentsSortMode = MdItemSortMode;

export type AccessoryFlags = {
  showHidden?: boolean;
  showLastUsed?: boolean;
  showTags?: boolean;
  showSize?: boolean;
  showAttrChanged?: boolean;
  showCreated?: boolean;
  showContentChanged?: boolean;
};

export interface ContentDropdownProps {
  view: ContentsViewMode;
  onViewChange: (view: ContentsViewMode) => void;
  sort: ContentsSortMode;
  onSortChange: (sort: ContentsSortMode) => void;
}

export type ContentsItemActionPanelProps = {
  type: MdItem["type"];
  path: string;
  target?: ReactNode;
  detail?: ReactNode;
};

export interface ContentsItemProps {
  entry: MdItem;
  actions: ReactNode;
  enabledAccessories: AccessoryFlags;
}

export interface ContentsProps {
  children: ReactNode;
  counts: number;
  view: ContentsViewMode;
  path: string;
  isLoading: boolean;
  searchBarAccessory: ReactElement<List.Dropdown.Props | Grid.Dropdown.Props>;
  columns: number;
}

export type ViewComponents = {
  view: ContentsViewMode;
  Container: ListRoot | GridRoot;
  Item: ListItem | GridItem;
  Dropdown: ListDropdown | GridDropdown;
};

export type ViewRegistry = Record<ContentsViewMode, ViewComponents>;
