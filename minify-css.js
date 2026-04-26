const fs = require('fs');
const CleanCSS = require('clean-css');

console.log('🔨 Iniciando minificação...\n');

// 1. Minificar CSS
console.log('📝 Minificando style.css...');
const cssOriginal = fs.readFileSync('style.css', 'utf8');
const cssMinified = new CleanCSS({ compatibility: 'ie8' }).minify(cssOriginal).styles;
const originalSize = cssOriginal.length / 1024;
const minifiedSize = cssMinified.length / 1024;
const savings = originalSize - minifiedSize;

fs.writeFileSync('style.min.css', cssMinified);
console.log(`✅ CSS minificado!`);
console.log(`   Antes: ${originalSize.toFixed(2)} KiB`);
console.log(`   Depois: ${minifiedSize.toFixed(2)} KiB`);
console.log(`   Ganho: ${savings.toFixed(2)} KiB (${((savings/originalSize)*100).toFixed(1)}%)\n`);

// 2. Copiar minificado para dist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}
fs.copyFileSync('style.min.css', 'dist/style.min.css');
fs.copyFileSync('style.min.css', 'dist/style.css'); // Também copia como style.css

console.log('✅ Arquivo copiado para dist/\n');
console.log('🎉 Minificação concluída!');
