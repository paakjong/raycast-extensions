import { Detail } from "@raycast/api";
import { useState, useEffect, useMemo, useRef } from "react";
import { Contents, type ContentsSortMode, type ContentsViewMode } from "$lib/components/contents";
import { useMditems } from "$lib/use-mditems";
import { sortMdItems } from "$lib/sort-mditems";
import { ItemDetail } from "../item-detail";
import type { DirectoryBrowserProps } from "./types";

export function DirectoryBrowser({
  path,
  initialView,
  initialSort,
  gridColumns,
  enabledAccessories,
}: DirectoryBrowserProps) {
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
          key={entry.path}
          entry={entry}
          enabledAccessories={enabledAccessories}
          actions={
            <Contents.ItemActionPanel
              type={entry.type}
              path={entry.path}
              target={
                <DirectoryBrowser
                  path={entry.path}
                  initialView={view}
                  initialSort={sort}
                  gridColumns={gridColumns}
                  enabledAccessories={enabledAccessories}
                />
              }
              detail={
                <ItemDetail
                  entry={entry}
                  directoryTarget={
                    <DirectoryBrowser
                      path={entry.path}
                      initialView={view}
                      initialSort={sort}
                      gridColumns={gridColumns}
                      enabledAccessories={enabledAccessories}
                    />
                  }
                />
              }
            />
          }
        />
      ))}
    </Contents>
  );
}
