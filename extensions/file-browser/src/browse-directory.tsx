import { getPreferenceValues } from "@raycast/api";
import { resolveStartDirectory } from "./lib/utils";
import { DirectoryBrowser } from "./lib/pages/directory-browser";

export default function Command() {
  const preferences = getPreferenceValues<ExtensionPreferences>();
  const initialPath = resolveStartDirectory(preferences.startDirectory);

  return (
    <DirectoryBrowser
      path={initialPath}
      initialView={preferences.viewMode}
      initialSort={preferences.sortMode}
      gridColumns={Number(preferences.gridColumns)}
    />
  );
}
