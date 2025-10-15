import { Icon, type Grid, type List } from "@raycast/api";
import type { ContentsItemProps } from "./types";
import { useContentsView } from "./contents";
import type { MdItem } from "$lib/types";
import { convertDate, formatFileSize } from "$lib/utils";
import { FINDER_TAG_COLORS } from "$lib/constants";

export const ContentsItem = ({ entry, actions, enabledAccessories }: ContentsItemProps) => {
  const baseProps = {
    title: entry.name,
    subtitle: entry.kind ?? undefined,
    quickLook: { path: entry.path, name: entry.name },
    actions: actions,
  };

  const { view, Item: ItemComponent } = useContentsView();
  let item: React.ReactNode;

  if (view === "grid") {
    const GridItem = ItemComponent as typeof Grid.Item;
    item = (
      <GridItem
        {...baseProps}
        key={entry.path}
        content={{ fileIcon: entry.path }}
        // accessory={}
      />
    );
  } else {
    const ListItem = ItemComponent as typeof List.Item;
    item = (
      <ListItem
        {...baseProps}
        key={entry.path}
        icon={{ fileIcon: entry.path }}
        accessories={createAccessories(entry, enabledAccessories)}
      />
    );
  }

  return item;
};

const createAccessories = (
  entry: MdItem,
  enabled: {
    showHidden?: boolean;
    showLastUsed?: boolean;
    showTags?: boolean;
    showSize?: boolean;
    showAttrChanged?: boolean;
    showCreated?: boolean;
    showContentChanged?: boolean;
  },
): List.Item.Accessory[] => {
  const acc: List.Item.Accessory[] = [];

  if (enabled?.showHidden && entry?.fsInvisible) {
    acc.push({ icon: Icon.EyeDisabled, tooltip: "Hidden" });
  }

  if (enabled?.showLastUsed && entry?.lastUsedDate != null) {
    const date = convertDate(entry.lastUsedDate);
    acc.push({
      date,
      tooltip: `Last used date: ${date.toLocaleString()}`,
    });
  }

  if (enabled?.showTags && entry?.userTags?.length > 0) {
    entry.userTags.forEach(({ name, colorIndex }) => {
      acc.push({
        tag: {
          value: name,
          color: FINDER_TAG_COLORS[colorIndex ?? 0],
        },
      });
    });
  }

  if (enabled?.showSize && entry?.size) {
    acc.push({
      text: formatFileSize(entry.size),
      tooltip: `Size: ${formatFileSize(entry.size)}`,
    });
  }

  if (enabled?.showAttrChanged && entry?.attributeChangeDate != null) {
    const date = convertDate(entry.attributeChangeDate);
    acc.push({
      date,
      tooltip: `Attribute change date: ${date.toLocaleString()}`,
    });
  }

  if (enabled?.showCreated && entry?.fsCreationDate != null) {
    const date = convertDate(entry.fsCreationDate);
    acc.push({
      date,
      tooltip: `Creation date: ${date.toLocaleString()}`,
    });
  }

  if (enabled?.showContentChanged && entry?.fsContentChangeDate != null) {
    const date = convertDate(entry.fsContentChangeDate);
    acc.push({
      date,
      tooltip: `Content change date: ${date.toLocaleString()}`,
    });
  }

  return acc;
};
