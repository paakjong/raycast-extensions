import type { ContentsSortMode, ContentsViewMode } from "../../components/contents/types";

export type DirectoryBrowserProps = {
  path: string;
  initialView: ContentsViewMode;
  initialSort: ContentsSortMode;
  gridColumns: number;
};
