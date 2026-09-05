const fs = require("node:fs");
const path = require("node:path");
const CleanCSS = require("clean-css");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "css", "style.css");
const outputPath = path.join(root, "css", "style.min.css");
const cssOriginal = fs.readFileSync(sourcePath, "utf8");
const result = new CleanCSS({ level: 2 }).minify(cssOriginal);

if (result.errors.length) {
  throw new Error(result.errors.join("\n"));
}

fs.writeFileSync(outputPath, result.styles);
console.log(`style.min.css: ${cssOriginal.length} -> ${result.styles.length} bytes`);
