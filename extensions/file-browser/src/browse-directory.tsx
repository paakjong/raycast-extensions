import { getPreferenceValues } from "@raycast/api";
import { resolveStartDirectory } from "$lib/utils";
import { DirectoryBrowser } from "$lib/pages/directory-browser";

export default function Command() {
  const preferences = getPreferenceValues<ExtensionPreferences>();
  const accessoryPrefs =
    getPreferenceValues<
      Pick<
        ExtensionPreferences,
        | "showHidden"
        | "showLastUsed"
        | "showTags"
        | "showSize"
        | "showAttrChanged"
        | "showCreated"
        | "showContentChanged"
      >
    >();
  const initialPath = resolveStartDirectory(preferences.startDirectory);

  return (
    <DirectoryBrowser
      path={initialPath}
      initialView={preferences.viewMode}
      initialSort={preferences.sortMode}
      gridColumns={Number(preferences.gridColumns)}
      enabledAccessories={{
        showHidden: accessoryPrefs.showHidden ?? true,
        showLastUsed: accessoryPrefs.showLastUsed ?? false,
        showTags: accessoryPrefs.showTags ?? true,
        showSize: accessoryPrefs.showSize ?? true,
        showAttrChanged: accessoryPrefs.showAttrChanged ?? false,
        showCreated: accessoryPrefs.showCreated ?? false,
        showContentChanged: accessoryPrefs.showContentChanged ?? false,
      }}
    />
  );
}
