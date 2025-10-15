import { useEffect, useState } from "react";
import type { MdItem } from "$lib/types";
import { getPreviewMarkdown } from "./file-preview";
import { generateFolderTree } from "./folder-tree";

export function useItemPreview(entry: MdItem) {
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setPreview(undefined);

    (async () => {
      if (entry.type === "directory") {
        const r = await generateFolderTree(entry.path);
        if (!cancelled) {
          setPreview(r.markdown);
        }
      } else {
        const md = await getPreviewMarkdown(entry);
        if (!cancelled) {
          setPreview(md);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [entry.path, entry.fsContentChangeDate, entry.size, entry.contentType, entry.name]);

  return preview;
}
