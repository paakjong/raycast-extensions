export type MdItemSortMode =
  | "name-asc"
  | "kind-asc"
  | "last-opened-asc"
  | "added-asc"
  | "modified-asc"
  | "created-asc"
  | "size-asc"
  | "tags-asc";

export type MdItemUserTag = {
  name: string;
  colorIndex: number | null;
};

export type MdItem = {
  type: "directory" | "file" | "symlink";
  name: string;
  path: string;
  size: number;
  userTags: MdItemUserTag[];
  attributeChangeDate: number;
  contentCreationDate: number;
  contentModificationDate: number;
  contentType: string;
  finderComment: string;
  kind: string;
  lastUsedDate: number | null;
  fsContentChangeDate: number;
  fsCreationDate: number;
  fsInvisible: boolean;
};

export interface MditemsOptions {
  sortMode?: MdItemSortMode;
}
