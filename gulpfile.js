const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const del = require("del");
const browserSync = require("browser-sync").create();

// Limpar pasta dist
function clean() {
  return del(["dist"]);
}

// Otimizar CSS
function css() {
  return gulp
    .src("style.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

// Otimizar JavaScript
function js() {
  return gulp
    .src("script.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
}

// Otimizar HTML
function html() {
  return gulp
    .src("index.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest("dist"));
}

// Otimizar imagens
function images() {
  return gulp
    .src("imagens/**/*")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest("dist/imagens"));
}

// Converter para WebP
function webpConvert() {
  return gulp
    .src("imagens/**/*.{jpg,jpeg,png}")
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest("dist/imagens"));
}

// Copiar arquivos estáticos
function copy() {
  return gulp.src(["*.txt", "*.xml", "*.ico"]).pipe(gulp.dest("dist"));
}

// Servidor de desenvolvimento
function serve() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });

  gulp.watch("style.css", css);
  gulp.watch("script.js", js);
  gulp.watch("index.html").on("change", browserSync.reload);
}

// Tarefa de build
const build = gulp.series(
  clean,
  gulp.parallel(css, js, html, images, webpConvert, copy)
);

// Tarefa de desenvolvimento
const dev = gulp.series(build, serve);

// Exportar tarefas
exports.clean = clean;
exports.css = css;
exports.js = js;
exports.html = html;
exports.images = images;
exports.webp = webpConvert;
exports.copy = copy;
exports.build = build;
exports.dev = dev;
exports.default = dev;
