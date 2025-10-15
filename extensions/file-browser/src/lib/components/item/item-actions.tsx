import { Action, ActionPanel, Icon } from "@raycast/api";
import type { ItemActionsProps } from "./types";

export const ItemActions = ({ entry, directoryTarget }: ItemActionsProps) => (
  <ActionPanel>
    <ActionPanel.Section>
      {entry.type === "directory" && directoryTarget && (
        <Action.Push title="Open in Browser" icon={Icon.Folder} target={directoryTarget} />
      )}
      <Action.Open
        title="Open"
        target={entry.path}
        icon={entry.type === "directory" ? Icon.Folder : Icon.ArrowRightCircle}
      />
      <Action.OpenWith path={entry.path} shortcut={{ modifiers: ["cmd"], key: "o" }} />
      <Action.ShowInFinder path={entry.path} shortcut={{ modifiers: ["cmd", "alt"], key: "r" }} />
      <Action.ToggleQuickLook shortcut={{ modifiers: ["cmd"], key: "y" }} />
    </ActionPanel.Section>
    <ActionPanel.Section>
      <Action.CopyToClipboard title="Copy Item" content={{ file: entry.path }} icon={Icon.Clipboard} />
      <Action.CopyToClipboard title="Copy Path" content={entry.path} icon={Icon.Clipboard} />
    </ActionPanel.Section>
    <ActionPanel.Section>
      <Action.Trash paths={entry.path} shortcut={{ modifiers: ["ctrl"], key: "x" }} />
    </ActionPanel.Section>
  </ActionPanel>
);
