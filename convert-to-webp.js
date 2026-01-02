const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Diretório das imagens
const imagensDir = path.join(__dirname, "imagens");

// Lista de imagens do portfólio para converter
const portfolioImages = [
  "Design com Henna + Brasileiro Capping.jpeg",
  "Design personalizado + Volume Brasileiro.jpeg",
  "Design personalizado + Volume Brasileiro (2).jpeg",
  "Design personalizado + Volume Brasileiro marrom.jpeg",
  "Design personalizado + Volume Brasileiro marrom (2).jpeg",
  "Efeito Fox delineado.jpeg",
  "Lash lifting e design com Henna.jpeg",
  "Volume 6D + Brow Lamination.jpeg",
  "Volume 6D + Brow Lamination (2).jpeg",
  "brasileirocapping.jpeg",
  "designercomhenna.jpeg",
  "efeitofox.jpeg",
  "efeitofoxdelineado.jpeg",
  "efeitofoxmarrom.jpeg",
  "lashliftingedesignercomhenna.jpeg",
  "laslifting.jpeg",
  "WhatsApp Image 2026-01-01 at 22.14.29.jpeg",
  "flutuante.jpeg",
  "anna (1).jpeg",
  "anna (2).jpeg",
  "anna (3).jpeg",
  "anna (4).jpeg",
];

// Configurações de qualidade WebP
const webpOptions = {
  quality: 85, // Qualidade alta mantendo tamanho reduzido
  effort: 6, // Nível de compressão (0-6, maior = melhor compressão)
};

async function convertToWebP() {
  console.log("🚀 Iniciando conversão para WebP...\n");

  let convertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const imageName of portfolioImages) {
    const inputPath = path.join(imagensDir, imageName);
    const outputPath = path.join(
      imagensDir,
      imageName.replace(".jpeg", ".webp")
    );

    // Verifica se o arquivo existe
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Arquivo não encontrado: ${imageName}`);
      skippedCount++;
      continue;
    }

    // Verifica se já foi convertido
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Já existe: ${imageName.replace(".jpeg", ".webp")}`);
      skippedCount++;
      continue;
    }

    try {
      // Converte para WebP
      await sharp(inputPath).webp(webpOptions).toFile(outputPath);

      // Compara tamanhos
      const originalSize = fs.statSync(inputPath).size;
      const webpSize = fs.statSync(outputPath).size;
      const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);

      console.log(`✅ ${imageName}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`   WebP: ${(webpSize / 1024).toFixed(1)} KB`);
      console.log(`   Redução: ${reduction}%\n`);

      convertedCount++;
    } catch (error) {
      console.error(`❌ Erro ao converter ${imageName}:`, error.message);
      errorCount++;
    }
  }

  console.log("\n📊 Resumo da Conversão:");
  console.log(`✅ Convertidas: ${convertedCount}`);
  console.log(`⏭️  Ignoradas (já existiam): ${skippedCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📁 Total processado: ${portfolioImages.length}`);
}

// Executa a conversão
convertToWebP().catch(console.error);
