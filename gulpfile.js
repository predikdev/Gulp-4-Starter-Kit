// Load modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// SASS Task
function compileSass() {
  return src('src/sass/**/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JS Task
function compileJS() {
  return src('src/js/app.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourceMap: '.' }));
}

// BrowserSync Task
function browserSyncStart(callback) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
  });
  callback();
}

// BrowserSync Reload Task
function browserSyncReload(callback) {
  browsersync.reload();
  callback();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['src/sass/**/*.scss', 'src/js/**/*.js'],
    series(compileSass, compileJS, browserSyncReload)
  );
}

// Default Gulp Task
exports.default = series(compileSass, compileJS, browserSyncStart, watchTask);
