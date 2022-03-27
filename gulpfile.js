// import dartSass from 'sass';
// import gulpSass from 'gulp-sass';

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const gulpPag = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const rename = require('gulp-rename');
//const sass = gulpSass(dartSass);
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const paths = {
  pug: {
    src: './src/pug/**/*.pug',
    dest: './'
  },
  html: {
    src: './src/html/**/*.html',
    dest: './'
  },
  scripts: {
    src: './src/scripts/**/*.js',
    dest: './dist/js/'
  }, 
  styles: {
    src: ['./src/styles/**/*.less','./src/styles/**/*.sass','./src/styles/**/*.scss'],
    dest: './dist/css/'
  }
}

function clean() {
  return del(['dist']);
}

function pug() {
  return gulp.src(paths.pug.src)
  .pipe(gulpPag({pretty: true}))
  .pipe(gulp.dest(paths.pug.dest))
  .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.stream());
}

function styles() {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  //.pipe(less())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    browser: 'chrome'
  });
  gulp.watch(paths.html.dest).on('change', browserSync.reload);
  //gulp.watch(paths.html.src, html);
  gulp.watch(paths.pug.src, pug);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.series(clean, pug, gulp.parallel(styles, scripts), watch);

exports.build = build;
exports.clean = clean;
exports.default = build;
exports.html = html;
exports.pug = pug;
exports.scripts = scripts;
exports.styles = styles;
exports.watch = watch;