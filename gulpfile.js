var gulp = require('gulp'),
    gutil = require('gutil'),
    webserver = require('gulp-webserver'),
    browserify = require('gulp-browserify'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    port = process.env.port || 7080;

gulp.task('copylibs', function() {
    return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
               .pipe(gulp.dest('./app/dist/css'));
});

gulp.task('coffee', function() {
    return gulp.src('./app/src/coffee/**/*.coffee')
               .pipe(coffee({bare:true}).on('error', gutil.log))
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('html', function() {
    return gulp.src('./app/src/html/index.html')
               .pipe(gulp.dest('./app/dist'));
});

gulp.task('js', function() {
    return gulp.src('./app/src/js/**/*.js')
               .pipe(gulp.dest('./app/link/js'));
});

gulp.task('css', function() {
    return gulp.src('./app/src/css/**/*.css')
               .pipe(gulp.dest('./app/dist/css'));
});

gulp.task('compile', ['copylibs', 'html', 'coffee', 'css', 'js']);

gulp.task('browserify', ['compile'], function() {
    return gulp.src('./app/link/js/main.js')
               .pipe(browserify({ transform: 'reactify' }))
               .pipe(gulp.dest('./app/dist/js'));
});

// launch browser
gulp.task('server', ['browserify'], function() {
    return gulp.src('./app/dist')
               .pipe(webserver({
                    livereload: true,
                    directoryListing: false,
                    open: true
                }));
});

gulp.task('watch', ['browserify'], function() {
    return gulp.watch('./app/src/**/*.*', ['browserify']);
});

gulp.task('default', ['browserify']);

gulp.task('serve', ['server', 'watch']);