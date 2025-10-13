import { List, Grid } from "@raycast/api";
import { createContext, useContext } from "react";
import type { ContentsProps, ViewComponents, ViewRegistry } from "./types";

const viewComponents: ViewRegistry = {
  list: {
    view: "list",
    Container: List,
    Item: List.Item,
    Dropdown: List.Dropdown,
  },
  grid: {
    view: "grid",
    Container: Grid,
    Item: Grid.Item,
    Dropdown: Grid.Dropdown,
  },
};

const ContentsContext = createContext<ViewComponents>(viewComponents.list);

export const useContentsView = () => useContext(ContentsContext);

export const ContentsRoot = ({
  children,
  counts,
  isLoading,
  view,
  path,
  columns,
  searchBarAccessory,
}: ContentsProps) => {
  const components = viewComponents[view ?? "list"];
  const ContentsComponent = components.Container;

  return (
    <ContentsContext.Provider value={components}>
      <ContentsComponent
        isLoading={isLoading}
        searchBarPlaceholder={`Search in ${path}`}
        searchBarAccessory={searchBarAccessory}
        columns={view === "grid" ? columns : undefined}
      >
        <ContentsComponent.EmptyView title="No Items" description="This directory does not contain visible entries." />
        <ContentsComponent.Section title={`Items • ${counts}`}>{children}</ContentsComponent.Section>
      </ContentsComponent>
    </ContentsContext.Provider>
  );
};
