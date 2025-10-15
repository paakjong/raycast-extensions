import type { AccessoryFlags, ContentsSortMode, ContentsViewMode } from "$lib/components/contents/types";

export type DirectoryBrowserProps = {
  path: string;
  initialView: ContentsViewMode;
  initialSort: ContentsSortMode;
  gridColumns: number;
  enabledAccessories: AccessoryFlags;
};
