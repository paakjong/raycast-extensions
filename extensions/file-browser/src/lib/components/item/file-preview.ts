import { environment } from "@raycast/api";
import { mkdir, readFile, stat } from "fs/promises";
import { basename, extname, join } from "path";
import { pathToFileURL } from "url";
import { execFile } from "child_process";
import type { MdItem } from "$lib/types";

const MAX_TEXT_PREVIEW_BYTES = 256 * 1024; // 256KB
const QL_THUMB_SIZE = 512;

function isMaybeImage(entry: MdItem) {
  if (entry.contentType?.startsWith("image/")) return true;
  const ext = extname(entry.path).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".tiff", ".tif", ".ico", ".svg"].includes(ext);
}

function isMaybeText(entry: MdItem) {
  if (entry.contentType?.startsWith("text/")) return true;
  const ext = extname(entry.path).toLowerCase();
  return [
    ".txt",
    ".md",
    ".mdx",
    ".json",
    ".log",
    ".yaml",
    ".yml",
    ".xml",
    ".csv",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".css",
    ".scss",
    ".html",
    ".svg",
    ".ini",
    ".toml",
    ".conf",
    ".env",
    ".py",
    ".rb",
    ".go",
    ".rs",
    ".java",
    ".kt",
    ".swift",
    ".c",
    ".cpp",
    ".h",
  ].includes(ext);
}

function extToLang(ext: string) {
  const map: Record<string, string> = {
    ".md": "md",
    ".mdx": "mdx",
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".xml": "xml",
    ".csv": "csv",
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
    ".css": "css",
    ".scss": "scss",
    ".html": "html",
    ".svg": "xml",
    ".ini": "ini",
    ".toml": "toml",
    ".conf": "conf",
    ".env": "bash",
    ".py": "python",
    ".rb": "ruby",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".kt": "kotlin",
    ".swift": "swift",
    ".c": "c",
    ".cpp": "cpp",
    ".h": "c",
  };
  return map[ext.toLowerCase()] ?? "";
}

async function tryReadSmallText(entry: MdItem): Promise<string | undefined> {
  try {
    if (entry.size > MAX_TEXT_PREVIEW_BYTES) return undefined;
    const data = await readFile(entry.path, { encoding: "utf8" });
    const ext = extname(entry.path);
    const lang = extToLang(ext);
    const escaped = data.replace(/```/g, "\u0060\u0060\u0060");
    const fenced = "```" + (lang ? `${lang}\n` : "\n") + escaped.slice(0, MAX_TEXT_PREVIEW_BYTES) + "\n```";
    return fenced;
  } catch {
    return undefined;
  }
}

async function generateQLThumbnail(entry: MdItem): Promise<string | undefined> {
  try {
    const baseDir = join(environment.supportPath, "thumbnails");
    await mkdir(baseDir, { recursive: true });

    // Always generate a fresh thumbnail (no caching)
    await new Promise<void>((resolve) => {
      execFile("qlmanage", ["-t", "-s", String(QL_THUMB_SIZE), "-o", baseDir, entry.path], () => resolve());
    });

    // qlmanage outputs `<basename>.png` in the target directory
    const produced = join(baseDir, `${basename(entry.path)}.png`);
    try {
      const st = await stat(produced);
      if (st.size > 0) {
        return pathToFileURL(produced).toString();
      }
    } catch {
      // No produced file; fall through
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export async function getPreviewMarkdown(entry: MdItem): Promise<string | undefined> {
  // 1) Direct image embed
  if (isMaybeImage(entry)) {
    return `![](${pathToFileURL(entry.path).toString()})`;
  }

  // 2) Small text embed
  if (isMaybeText(entry)) {
    const text = await tryReadSmallText(entry);
    if (text) return text;
  }

  // 3) Quick Look thumbnail as image
  const thumb = await generateQLThumbnail(entry);
  if (thumb) {
    return `![](${thumb})`;
  }

  return undefined;
}
