var gulp = require('gulp'),
    webserver = require('gulp-webserver'),

    browserify = require('browserify'),
    babelify = require('babelify'),

    source = require('vinyl-source-stream'),

    es = require('event-stream'),
    sass = require('gulp-sass'),

    uglify = require('gulp-uglify'),
    insert = require('gulp-insert');

var bundleLibrary = function(entryFile, targetFile, destination) {
    return browserify()
                .add(entryFile)
                .bundle()
                .pipe(source(targetFile))
                .pipe(gulp.dest(destination));
};

gulp.task('html', function() {
    return gulp.src('./app/src/html/index.html')
               .pipe(gulp.dest('./app/dist'));
});

gulp.task('font', function() {
    return gulp.src('./app/src/font/**/*.*')
        .pipe(gulp.dest('./app/dist/font'));
});

gulp.task('svg', function() {
    return gulp.src('./app/src/svg/lorenz.svg')
        .pipe(gulp.dest('./app/dist/svg'));
});

gulp.task('favicon', function() {
    return es.merge(
        gulp.src('./app/src/favicon/**/*.*')
            .pipe(gulp.dest('./app/dist/favicon')),
        gulp.src('./app/src/favicon/favicon.ico')
            .pipe(gulp.dest('./app/dist'))
    );
});

gulp.task('js', function() {
    return browserify('./app/src/js/main.js', {debug: true})
        .transform(babelify, {
            plugins: [
                'syntax-class-properties',
                'transform-class-properties',
                'syntax-decorators',
                'transform-decorators',
                'syntax-async-functions',
                'transform-regenerator'
            ],
            presets: [ 'es2015', 'react' ]
        })
        .bundle()
        .pipe(source('main.js'))
        //.pipe(insert.prepend("/** @preventMunge */"))
        .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('sass', function() {
    return gulp.src('./app/src/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/dist/css'));
});


gulp.task('build', ['js', 'sass', 'html', 'svg', 'font', 'favicon']);

/* SERVER & BROWSER TASKS */

gulp.task('server', ['build'], function() {
    return gulp.src('./app/dist')
               .pipe(webserver({
                    livereload: false,
                    directoryListing: false,
                    open: true
                }));
});

gulp.task('watch', ['build'], function() {
    return gulp.watch('./app/src/**/*.*', ['build']);
});

gulp.task('default', ['build']);

gulp.task('serve', ['server', 'watch']);