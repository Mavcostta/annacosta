const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const errors = [];

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const attributes = source.matchAll(/(?:src|href|srcset)=["']([^"']+)["']/gi);

  for (const match of attributes) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)) continue;

    const [rawPath, fragment] = reference.split("#", 2);
    const cleanPath = decodeURIComponent(rawPath.split("?", 1)[0]).replace(/^\//, "");
    const target = cleanPath ? path.join(root, cleanPath) : path.join(root, file);

    if (cleanPath && !fs.existsSync(target)) {
      errors.push(`${file}: arquivo ausente: ${reference}`);
      continue;
    }

    if (fragment && target.endsWith(".html")) {
      const targetSource = fs.readFileSync(target, "utf8");
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`(?:id|name)=["']${escaped}["']`, "i").test(targetSource)) {
        errors.push(`${file}: âncora ausente: ${reference}`);
      }
    }
  }
}

for (const file of fs.readdirSync(path.join(root, "css")).filter((name) => name.endsWith(".css"))) {
  const sourcePath = path.join(root, "css", file);
  const source = fs.readFileSync(sourcePath, "utf8");

  for (const match of source.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
    const reference = match[1];
    if (/^(?:https?:|data:|#)/i.test(reference)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(sourcePath), decodeURIComponent(reference)))) {
      errors.push(`css/${file}: arquivo ausente: ${reference}`);
    }
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
for (const icon of manifest.icons || []) {
  if (!fs.existsSync(path.join(root, icon.src.replace(/^\//, "")))) {
    errors.push(`manifest.json: arquivo ausente: ${icon.src}`);
  }
}

const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const cacheList = serviceWorker.match(/const urlsToCache = \[([\s\S]*?)\];/)?.[1] || "";
for (const match of cacheList.matchAll(/["'](\/[^"]*)["']/g)) {
  const reference = match[1];
  const target = reference === "/" ? "index.html" : reference.replace(/^\//, "");
  if (!fs.existsSync(path.join(root, target))) {
    errors.push(`sw.js: arquivo ausente: ${reference}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`${htmlFiles.length} HTMLs e assets sem referências locais quebradas`);
}
