import { Detail, Icon } from "@raycast/api";
import { pathToFileURL } from "url";
import type { MdItem } from "$lib/types";
import { convertDate, formatFileSize } from "$lib/utils";
import { FINDER_TAG_COLORS } from "$lib/constants";
import type { ItemMetadataProps } from "./types";

export const ItemMetadata = ({ entry }: ItemMetadataProps) => {
  return (
    <Detail.Metadata>
      <Detail.Metadata.Label title="Name" text={entry.name} />
      <Detail.Metadata.Label title="Kind" text={entry.kind} />
      <Detail.Metadata.Label title="Type" text={entry.type} />
      <Detail.Metadata.Link title="Path" text={entry.path} target={pathToFileURL(entry.path).toString()} />
      <Detail.Metadata.Label title="Size" text={getSizeLabel(entry)} />
      <Detail.Metadata.Label title="Content Type" text={entry.contentType} />
      {entry.fsInvisible && (
        <Detail.Metadata.TagList title="Attributes">
          <Detail.Metadata.TagList.Item text="Hidden" icon={Icon.EyeDisabled} />
        </Detail.Metadata.TagList>
      )}
      <Detail.Metadata.TagList title="Tags">
        {entry.userTags.map(({ name, colorIndex }, index) => (
          <Detail.Metadata.TagList.Item
            key={`${name}-${index}`}
            text={name}
            color={FINDER_TAG_COLORS[colorIndex ?? 0]}
          />
        ))}
      </Detail.Metadata.TagList>
      {entry.finderComment && <Detail.Metadata.Label title="Finder Comment" text={entry.finderComment} />}
      <Detail.Metadata.Separator />
      <Detail.Metadata.Label title="Created" text={convertDate(entry.fsCreationDate).toLocaleString()} />
      <Detail.Metadata.Label title="Content Created" text={convertDate(entry.contentCreationDate).toLocaleString()} />
      <Detail.Metadata.Label title="Modified" text={convertDate(entry.contentModificationDate).toLocaleString()} />
      <Detail.Metadata.Label title="Content Changed" text={convertDate(entry.fsContentChangeDate).toLocaleString()} />
      <Detail.Metadata.Label title="Attribute Changed" text={convertDate(entry.attributeChangeDate).toLocaleString()} />
      {entry.lastUsedDate != null && (
        <Detail.Metadata.Label title="Last Used" text={convertDate(entry.lastUsedDate).toLocaleString()} />
      )}
    </Detail.Metadata>
  );
};

const getSizeLabel = (entry: MdItem) => {
  return entry.type === "directory"
    ? entry.size > 0
      ? formatFileSize(entry.size)
      : undefined
    : formatFileSize(entry.size);
};
