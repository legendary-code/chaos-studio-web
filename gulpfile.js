var gulp = require('gulp'),
    webserver = require('gulp-webserver'),

    browserify = require('browserify'),
    reactify = require('reactify'),
    es6ify = require('es6ify'),

    source = require('vinyl-source-stream'),

    es = require('event-stream'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify');

var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({ advanced: true });
/**
 * Build happens in two phases:
 * 1) Stage - copies/compiles all various less, js, css, etc. files from libs and src folder to 'link' folder for final packaging
 * 2) Link - finalizes files, by compiling less files, browserifying, minifying, etc. into the final 'dist' folder
 */

var bundleLibrary = function(entryFile, targetFile, destination) {
    var bundler = browserify(entryFile, {debug: true});
    var stream = bundler.bundle();

    stream.on('error', function(err) {
        console.error(err);
    });

    return stream.pipe(source(targetFile))
                 .pipe(gulp.dest(destination));
};

/* LIBRARIES */

gulp.task('three', function() {
    return gulp.src('./node_modules/three/three.js')
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('d3', function() {
    return gulp.src('./node_modules/d3/d3.js')
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('react-router', function() {
    return bundleLibrary('./node_modules/react-router/modules/index.js', 'react-router.js', './app/link/js');
});

gulp.task('material-ui', function() {
    return es.merge(
        bundleLibrary('./node_modules/material-ui/lib/index.js', 'material-ui.js', './app/link/js'),
        gulp.src('./node_modules/material-ui/src/less/**/*.less')
            .pipe(gulp.dest('./app/link/less/material-ui')),
        gulp.src('./node_modules/material-ui/src/less/**/*.css')
            .pipe(gulp.dest('./app/link/less/material-ui'))
    );
});

/* STAGING TASKS */

gulp.task('html', function() {
    return gulp.src('./app/src/html/index.html')
               .pipe(gulp.dest('./app/dist'));
});

gulp.task('js', function() {
    return es.merge(
        gulp.src('./app/src/js/**/*.jsx')
            .pipe(gulp.dest('./app/link/js')),
        gulp.src('./app/src/js/**/*.js')
            .pipe(gulp.dest('./app/link/js'))
    );
});

gulp.task('less', function() {
    return gulp.src('./app/src/less/**/*.*')
               .pipe(gulp.dest('./app/link/less'));
});

/* LINK TASKS */

gulp.task('link-js', ['stage'], function() {
    var entryFile = './app/link/js/main.js';
    es6ify.traceurOverrides = {experimental : true};

    var bundler = browserify(es6ify.runtime, {debug: true})
                    .add(entryFile)
                    .transform(reactify)
                    .transform(es6ify);
                    //.transform(uglify);

    var stream = bundler.bundle();
    stream.on('error', function(err) {
        console.error(err);
    });

    return stream.pipe(source('main.js'))
                 .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('link-less', ['stage'], function() {
    return gulp.src('./app/link/less/main.less')
               .pipe(less({ plugins: [cleancss] }))
               .pipe(gulp.dest('./app/dist/css'));
});

/* BUILD PHASES */

gulp.task('libs', ['material-ui', 'd3', 'three']);

gulp.task('stage', ['libs', 'html', 'less', 'js']);

gulp.task('link', ['stage', 'link-js', 'link-less']);

/* SERVER & BROWSER TASKS */

gulp.task('server', ['link'], function() {
    return gulp.src('./app/dist')
               .pipe(webserver({
                    livereload: false,
                    directoryListing: false,
                    open: true
                }));
});

gulp.task('watch', ['link'], function() {
    return gulp.watch('./app/src/**/*.*', ['link']);
});

gulp.task('default', ['link']);

gulp.task('serve', ['server', 'watch']);