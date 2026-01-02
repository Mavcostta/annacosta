const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./imagens";
const outputDir = "./imagens-webp";

// Criar diretório de saída se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Função para converter imagem para WebP
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(
      1
    );

    console.log(
      `✅ ${path.basename(inputPath)} → ${path.basename(
        outputPath
      )} (-${reduction}%)`
    );
  } catch (error) {
    console.error(`❌ Erro ao converter ${inputPath}:`, error.message);
  }
}

// Processar todas as imagens
async function processImages() {
  console.log("🚀 Iniciando conversão para WebP...\n");

  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

  console.log(`📸 Encontradas ${imageFiles.length} imagens para converter\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      outputDir,
      file.replace(/\.(jpg|jpeg|png)$/i, ".webp")
    );
    await convertToWebP(inputPath, outputPath);
  }

  console.log("\n✨ Conversão concluída!");
  console.log(`📁 Imagens WebP salvas em: ${outputDir}`);
}

processImages();
