"use strict";

const gulp = require('gulp'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    sourcemaps = require("gulp-sourcemaps"),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create("Sketchbook");

var production = process.env.NODE_ENV === 'production';

const dependencies = [
    'three',
    'three-orbit-controls',
    'stats.js'
];


/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', () => {
    return gulp.src([
            'bower_components/tinycolor/dist/tinycolor-min.js',
            'bower_components/raf.js/raf.min.js',
        ]).pipe(concat('vendor.js'))
        .pipe(gulpif(production, uglify({
            mangle: false
        })))
        .pipe(gulp.dest('app/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', () => {
    return browserify()
        .require(dependencies)
        .bundle()
        .pipe(source('vendor.bundle.js'))
        .pipe(buffer())
        .pipe(gulpif(production, uglify({
            mangle: false
        })))
        .pipe(gulp.dest('app/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], () => {
    return browserify({
            entries: 'src/app.js',
            debug: true
        })
        .external(dependencies)
        .transform(babelify, {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(gulpif(production, uglify({
            mangle: false
        })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/js'));
});


/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], () => {
    let bundler = watchify(browserify({
        entries: 'src/app.js',
        extensions: ['.js'],
        debug: true
    }, watchify.args));

    bundler.external(dependencies);
    bundler.transform(babelify, {
        presets: ['es2015']
    });
    bundler.on('update', rebundle);

    return rebundle();

    function rebundle() {
        let start = Date.now();
        return bundler.bundle()
            .on('error', (err) => {
                gutil.log(gutil.colors.red(err.toString()));
            })
            .on('end', () => {
                gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('app/js'))
            .pipe(browserSync.stream());
    }
});


gulp.task('browser-sync', () => {
    browserSync.init(null, {
        server: "./app",
        port: 3000
    });
});


gulp.task('default', ['browser-sync', 'vendor', 'browserify-watch']);
gulp.task('build', ['vendor', 'browserify']);