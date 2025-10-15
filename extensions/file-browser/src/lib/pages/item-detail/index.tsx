import { Detail } from "@raycast/api";
import { useItemPreview, ItemMetadata, ItemActions } from "$lib/components/item";
import type { ItemDetailProps } from "./types";

export function ItemDetail({ entry, directoryTarget }: ItemDetailProps) {
  const preview = useItemPreview(entry);

  return (
    <Detail
      navigationTitle={entry.name}
      markdown={preview}
      metadata={<ItemMetadata entry={entry} />}
      actions={<ItemActions entry={entry} directoryTarget={directoryTarget} />}
    />
  );
}
