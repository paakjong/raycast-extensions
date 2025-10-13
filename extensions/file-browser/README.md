# File Browser

Built by [Voyager](https://voyager.fm/?ref=raycast)

[![Voyager Banner](assets/voyager-banner.png)](https://voyager.fm/?ref=raycast)

---

Browse and manage your Mac's files directly from Raycast with flexible layouts, rich metadata, and quick actions.

## Features
- Navigate through directories with instant previews powered by Spotlight metadata.
- Toggle between list and grid layouts, adjusting the number of columns to match your workflow.
- Sort items by name, kind, dates, size, or tags to surface the right files fast.
- Run file-specific actions such as revealing in Finder, copying paths, or drilling into subdirectories.

## Command
- **Browse Directory** — Open any folder, explore its contents, and act on files without leaving Raycast.

## Preferences
- **Start Directory**: Choose the folder that loads when the command opens. Defaults to your home directory.
- **Default View Mode**: Pick between `List` and `Grid`.
- **Grid Columns**: Configure the number of columns (4–8) used when the grid view is active.
- **Default Sort**: Select the initial sort order (`Name`, `Kind`, `Date Last Opened`, `Date Added`, `Date Modified`, `Date Created`, `Size`, `Tags`).

## Development
1. Follow the official contribution guide: [Contribute to an Extension](https://developers.raycast.com/basics/contribute-to-an-extension).
2. If you touched the native Spotlight helper (Rust), run `npm run build:native` to rebuild and copy the updated binary into `assets/mditems`.
3. For additional setup and publishing steps, refer to the Raycast documentation.
