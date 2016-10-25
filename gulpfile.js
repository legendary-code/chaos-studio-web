var gulp = require('gulp'),
    dest = require('gulp-dest'),
    fs = require("fs"),
    webserver = require('gulp-webserver'),

    browserify = require('browserify'),
    reactify = require('reactify'),
    babelify = require('babelify'),

    source = require('vinyl-source-stream'),

    es = require('event-stream'),
    sass = require('gulp-sass'),

    insert = require('gulp-insert'),
    transform = require('gulp-transform'),
    Showdown = require('showdown'),
    hljs = require('highlight.js'),
    jsdom = require("jsdom"),
    window = jsdom.jsdom().defaultView,
    $ = require('jquery')(window),
    globify = require('require-globify'),
    urlencode = require('gulp-css-urlencode-inline-svgs');

/**
 * Build happens in two phases:
 * 1) Stage - copies/compiles all various less, js, css, etc. files from libs and src folder to 'link' folder for final packaging
 * 2) Link - finalizes files, by compiling less files, browserifying, minifying, etc. into the final 'dist' folder
 */

var renderMarkdown = function(markdown) {
    var converter = new Showdown.Converter();
    var markup = $(converter.makeHtml(markdown));

    // make all non-relative links open in new tab
    markup.find('a').each(function(i, link) {
        if (link.host !== window.location.host) {
            link.target = '_blank';
        }
    });

    // syntax highlight
    markup.find('code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    // wrap in div so next query succeeds and our
    // html can be rendered
    markup = $('<div>').append(markup);

    // fix scrolling issues by wrapping code in div
    // on mobile devices, setting overflow-x:scroll
    // in <code> doesn't seem to reliably work
    markup.find('pre code').wrapInner("<div class='scrollable'></div>");

    return markup.html();
};

/* LIBRARIES */
gulp.task('three', function() {
    return gulp.src('./node_modules/three/three.js')
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('jquery', function() {
    return es.merge(
        gulp.src('./app/src/libs/jquery-mobile-1.4.5-vmouse-only/jquery.mobile.custom.js')
            .pipe(gulp.dest('./app/link/js')),
        gulp.src('./node_modules/jquery/dist/jquery.js')
            .pipe(gulp.dest('./app/link/js'))
    );
});

/* STAGING TASKS */

gulp.task('html', function() {
    return gulp.src('./app/src/html/index.html')
               .pipe(gulp.dest('./app/dist'));
});

gulp.task('js', function() {
    return es.merge(
        gulp.src('./app/libs/**/*.js')
            .pipe(gulp.dest('./app/link/js')),
        gulp.src('./app/src/js/**/*.js')
            .pipe(insert.prepend("/** @preventMunge */"))
            .pipe(gulp.dest('./app/link/js'))
    );
});

gulp.task('sass', function() {
    return gulp.src('./app/src/sass/**/*.*')
        .pipe(gulp.dest('./app/link/sass'));
});

gulp.task('font', function() {
    return gulp.src('./app/src/font/**/*.*')
        .pipe(gulp.dest('./app/dist/font'));
});

gulp.task('md', function() {
    return gulp.src('./app/src/markdown/**/*.md')
        .pipe(transform(renderMarkdown, {encoding: 'utf8'}))
        .pipe(dest('./app/dist/markdown', {ext: 'html'}))
        .pipe(gulp.dest('./'));
});

gulp.task('svg', function() {
    return gulp.src('./app/src/svg/lorenz.svg')
        .pipe(gulp.dest('./app/dist/svg'));
});

gulp.task('png', function() {
    return gulp.src('./app/src/markdown/png/**/*.png')
        .pipe(gulp.dest('./app/dist/png'));
});

gulp.task('favicon', function() {
    return es.merge(
        gulp.src('./app/src/favicon/**/*.*')
            .pipe(gulp.dest('./app/dist/favicon')),
        gulp.src('./app/src/favicon/favicon.ico')
            .pipe(gulp.dest('./app/dist'))
    );
});

/* LINK TASKS */
gulp.task('link-js', ['stage'], function() {
    return browserify()
                .add('./app/link/js/main.js')
                .transform(reactify, {es6: true, stripTypes: true, dev: false})
                .transform(babelify)
                .transform(globify)
                .bundle()
                .on('error', function(err) {
                    console.error(err);
                })
                .pipe(source('main.js'))
                .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('link-sass', ['stage'], function() {
    return gulp.src('./app/link/sass/main.scss')
        .pipe(sass())
        .pipe(urlencode())
        .pipe(gulp.dest('./app/dist/css'));
});

/* BUILD PHASES */

gulp.task('libs', ['three', 'jquery']);

gulp.task('stage', ['libs', 'html', 'sass', 'md', 'js', 'svg', 'png', 'font', 'favicon']);

gulp.task('link', ['stage', 'link-js', 'link-sass']);

/* SERVER & BROWSER TASKS */

gulp.task('server', ['link'], function() {
    return gulp.src('./app/dist')
               .pipe(webserver({
                    livereload: false,
                    directoryListing: false,
                    open: 'http://localhost:8000',
                    host: '0.0.0.0'
                }));
});

gulp.task('watch', ['link'], function() {
    return gulp.watch('./app/src/**/*.*', ['link']);
});

gulp.task('default', ['link']);

gulp.task('serve', ['server', 'watch']);