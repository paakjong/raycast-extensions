import { Action, ActionPanel, Icon } from "@raycast/api";
import type { ContentsItemActionPanelProps } from "./types";

export const ContentsItemActionPanel = ({ type, path, target, detail }: ContentsItemActionPanelProps) => {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        {type === "directory" && target && <Action.Push target={target} title="Open" icon={Icon.Folder} />}
        {type === "file" && <Action.Open title="Open" target={path} icon={Icon.ArrowRightCircle} />}
        {detail && (
          <Action.Push
            target={detail}
            title="Open Detail"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd", "shift"], key: "enter" }}
          />
        )}
        <Action.OpenWith path={path} shortcut={{ modifiers: ["cmd"], key: "o" }} />
        <Action.ShowInFinder path={path} shortcut={{ modifiers: ["cmd", "alt"], key: "r" }} />
        <Action.ToggleQuickLook />
      </ActionPanel.Section>
      <ActionPanel.Section>
        <Action.CopyToClipboard title="Copy Item" content={{ file: path }} icon={Icon.Clipboard} />
        <Action.CopyToClipboard title="Copy Path" content={path} icon={Icon.Clipboard} />
      </ActionPanel.Section>
      <ActionPanel.Section>
        {/* TODO: Add edit view */}
        {/* <Action.Push target={null} title="Edit" icon={Icon.Pencil} shortcut={{ modifiers: ["cmd"], key: "enter" }} /> */}
        <Action.Trash paths={path} shortcut={{ modifiers: ["ctrl"], key: "x" }} />
      </ActionPanel.Section>
    </ActionPanel>
  );
};
