import { Icon } from "@raycast/api";
import type { ContentDropdownProps, ContentsSortMode, ContentsViewMode } from "./types";
import { useContentsView } from "./contents";

const viewOptions: Array<{ label: string; value: ContentsViewMode; icon: Icon }> = [
  { label: "List", value: "list", icon: Icon.AppWindowList },
  { label: "Grid", value: "grid", icon: Icon.AppWindowGrid3x3 },
];

const sortOptions: Array<{ label: string; value: ContentsSortMode }> = [
  { label: "Name", value: "name-asc" },
  { label: "Kind", value: "kind-asc" },
  { label: "Date Last Opened", value: "last-opened-asc" },
  { label: "Date Added", value: "added-asc" },
  { label: "Date Modified", value: "modified-asc" },
  { label: "Date Created", value: "created-asc" },
  { label: "Size", value: "size-asc" },
  { label: "Tags", value: "tags-asc" },
];

const viewValue = (mode: ContentsViewMode) => `view:${mode}` as const;
const sortValue = (mode: ContentsSortMode) => `sort:${mode}` as const;
const viewLabelMap = viewOptions.reduce<Record<ContentsViewMode, string>>(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<ContentsViewMode, string>,
);
const sortLabelMap = sortOptions.reduce<Record<ContentsSortMode, string>>(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<ContentsSortMode, string>,
);

export const ContentsDropdown = ({ view, sort, onViewChange, onSortChange }: ContentDropdownProps) => {
  const { Dropdown: DropdownComponent } = useContentsView();
  const summaryValue = "summary";
  const viewLabel = `􀦍 ${viewLabelMap[view]}`;
  const sortLabel = `􀵬 ${sortLabelMap[sort] ?? "Name"}`;
  const summaryLabel = `${viewLabel} • ${sortLabel}`;

  const handleChange = (newValue: string) => {
    if (newValue === summaryValue) {
      return;
    }

    if (newValue.startsWith("view:")) {
      onViewChange(newValue.slice("view:".length) as ContentsViewMode);
    } else if (newValue.startsWith("sort:")) {
      onSortChange(newValue.slice("sort:".length) as ContentsSortMode);
    }
  };

  return (
    <DropdownComponent tooltip="Change View or Sort" value={summaryValue} storeValue={false} onChange={handleChange}>
      <DropdownComponent.Item value={summaryValue} title={summaryLabel} />
      <DropdownComponent.Section title="􀦍 View">
        {viewOptions.map((option) => (
          <DropdownComponent.Item
            key={option.value}
            title={option.label}
            value={viewValue(option.value)}
            icon={option.icon}
          />
        ))}
      </DropdownComponent.Section>
      <DropdownComponent.Section title="􀵬 Sort By">
        {sortOptions.map((option) => (
          <DropdownComponent.Item
            key={option.value}
            title={option.label}
            value={sortValue(option.value)}
            icon={sort === option.value ? Icon.Cd : Icon.Circle}
          />
        ))}
      </DropdownComponent.Section>
    </DropdownComponent>
  );
};
