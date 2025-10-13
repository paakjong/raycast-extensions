import { ContentsDropdown } from "./contents-dropdown";
import { ContentsItemActionPanel } from "./contents-item-actions";
import { ContentsItem } from "./contents-item";
import { ContentsRoot, useContentsView } from "./contents";
import type { ContentsSortMode, ContentsViewMode } from "./types";

type ContentsCompoundComponent = typeof ContentsRoot & {
  Item: typeof ContentsItem;
  ItemActionPanel: typeof ContentsItemActionPanel;
  Dropdown: typeof ContentsDropdown;
};

const Contents: ContentsCompoundComponent = Object.assign(ContentsRoot, {
  Item: ContentsItem,
  ItemActionPanel: ContentsItemActionPanel,
  Dropdown: ContentsDropdown,
});

export { Contents, useContentsView, ContentsViewMode, ContentsSortMode };
