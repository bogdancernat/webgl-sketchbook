"use strict";

var os        = require('os')
, gulp        = require('gulp')
, concat      = require('gulp-concat')
, sass        = require('gulp-sass')
, babel       = require('gulp-babel')
, uglify      = require('gulp-uglify')
, obfuscate   = require('gulp-obfuscate')
, sourcemaps  = require("gulp-sourcemaps")
, browserSync = require('browser-sync').create("Sketchbook")
;

// Static Server + watching html files
gulp.task('serve', () => {
  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/*.html").on('change', browserSync.reload);
  gulp.watch("app/js/*.js").on('change', browserSync.reload);
  gulp.watch("src/*.js", ['babel']);
});

gulp.task('vendor', () => {
  return gulp.src([
    'bower_components/tinycolor/dist/tinycolor-min.js',
    'bower_components/raf.js/raf.min.js',
    'bower_components/three.js/build/three.js'
  ]).pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
});

gulp.task('babel', () => {
  return gulp.src("src/app.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    // .pipe(obfuscate())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./app/js'));
});

gulp.task('default', ['vendor', 'babel', 'serve']);