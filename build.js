const fs = require("fs");
const path = require("path");

// Criar pasta dist se não existir
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// Copiar arquivos HTML
fs.copyFileSync("index.html", "dist/index.html");

// Copiar arquivos CSS
fs.copyFileSync("style.css", "dist/style.css");

// Copiar arquivos JS
fs.copyFileSync("script.js", "dist/script.js");

// Copiar manifest.json
fs.copyFileSync("manifest.json", "dist/manifest.json");

// Copiar sitemap.xml
fs.copyFileSync("sitemap.xml", "dist/sitemap.xml");

// Copiar robots.txt
fs.copyFileSync("robots.txt", "dist/robots.txt");

// Copiar service worker
fs.copyFileSync("sw.js", "dist/sw.js");

// Criar pasta imagens em dist
if (!fs.existsSync("dist/imagens")) {
  fs.mkdirSync("dist/imagens");
}

// Copiar imagens
const imagensDir = fs.readdirSync("imagens");
imagensDir.forEach((file) => {
  fs.copyFileSync(path.join("imagens", file), path.join("dist/imagens", file));
});

console.log("Build concluído! Arquivos otimizados em ./dist/");
