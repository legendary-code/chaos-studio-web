var gulp = require('gulp'),
    gutil = require('gutil'),
    webserver = require('gulp-webserver'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    es = require('event-stream'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    traceur = require('gulp-traceur'),
    port = process.env.port || 7080;

var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({ advanced: true });
/**
 * Build happens in two phases:
 * 1) Stage - copies/compiles all various less, js, css, etc. files from libs and src folder to 'link' folder for final packaging
 * 2) Link - finalizes files, by compiling less files, browserifying, minifying, etc. into the final 'dist' folder
 */

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
    return gulp.src('./node_modules/react-router/modules/index.js')
               .pipe(browserify())
               .pipe(concat('react-router.js'))
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('material-ui', function() {
    return es.merge(
        gulp.src('./node_modules/material-ui/lib/index.js')
            .pipe(browserify())
            .pipe(concat('material-ui.js'))
            .pipe(gulp.dest('./app/link/js')),
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
    return gulp.src('./app/src/js/**/*.js')
               .pipe(traceur())
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('less', function() {
    return gulp.src('./app/src/less/**/*.*')
               .pipe(gulp.dest('./app/link/less'));
});

/* LINK TASKS */

gulp.task('link-js', ['stage'], function() {
    return gulp.src('./app/link/js/main.js')
               .pipe(browserify({ transform: 'reactify' }))
               //.pipe(uglify())
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