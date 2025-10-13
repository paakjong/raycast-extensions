import { Detail } from "@raycast/api";
import { useState, useEffect, useMemo, useRef } from "react";
import type { DirectoryBrowserProps } from "./types";
import { Contents } from "../../components/contents";
import type { ContentsSortMode, ContentsViewMode } from "../../components/contents/types";
import { useMditems } from "../../use-mditems";
import { sortMdItems } from "../../sort-mditems";

export function DirectoryBrowser({ path, initialView, initialSort, gridColumns }: DirectoryBrowserProps) {
  const [view, setView] = useState<ContentsViewMode>(initialView);
  const [sort, setSort] = useState<ContentsSortMode>(initialSort);
  const sortRef = useRef(sort);

  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  const fetchSortMode = useMemo(() => sortRef.current, [path]);
  const { data, isLoading, error } = useMditems(path, { sortMode: fetchSortMode });

  const sortedEntries = useMemo(() => sortMdItems(data, sort), [data, sort]);

  if (error) {
    return <Detail markdown={`## mditems failed\n\n\`${error.message}\``} />;
  }

  return (
    <Contents
      view={view}
      path={path}
      counts={sortedEntries.length}
      isLoading={isLoading}
      searchBarAccessory={<Contents.Dropdown view={view} sort={sort} onViewChange={setView} onSortChange={setSort} />}
      columns={gridColumns}
    >
      {sortedEntries.map((entry) => (
        <Contents.Item
          entry={entry}
          actions={
            <Contents.ItemActionPanel
              type={entry.type}
              path={entry.path}
              target={
                <DirectoryBrowser path={entry.path} initialView={view} initialSort={sort} gridColumns={gridColumns} />
              }
            />
          }
        />
      ))}
    </Contents>
  );
}
