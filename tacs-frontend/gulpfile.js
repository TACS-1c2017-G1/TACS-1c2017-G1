var gulp = require('gulp'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	path = require('path'),
	cleanCSS = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
  browserSync = require('browser-sync').create();

gulp.task('combo',['uglify','minify','minify-css']);

gulp.task('watch', function() {
	gulp.watch('dev/src/**/*.js',['concat']);
	gulp.watch('dev/styles/**/*.less',['less']);
});

// Static server
gulp.task('devSync', function() {
    browserSync.init({
        server: {
            baseDir: "./dev"
        }
    });
    gulp.watch('dev/src/**/*.js',['concat']).on('change', browserSync.reload);
    gulp.watch('dev/styles/**/*.less',['less']).on('change', browserSync.reload);
    gulp.watch("dev/**/*.html").on('change', browserSync.reload);
});

// Static server
gulp.task('docsSync', function() {
    browserSync.init({
        server: {
            baseDir: "./docs"
        }
    });
});

gulp.task('concat', function() {
	gulp.src('dev/src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dev'));
});


gulp.task('uglify', function() {
    gulp.src('dev/src/**/*.js')
		.pipe(concat('bundle.js'))
    //FIXME	.pipe(uglify())
		.pipe(rename('bundle.js'))
    	.pipe(gulp.dest('docs'));
});

gulp.task('minify', function() {
  gulp.src('dev/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('docs'));
  return gulp.src('dev/templates/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('docs/templates'));
});

gulp.task('less', function () {
  return gulp.src('dev/styles/mainStyle.less')
  	.pipe(sourcemaps.init())	
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('dev'));
});

gulp.task('minify-css',['less'], function() {
  return gulp.src('dev/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('docs'));
});

gulp.task('compilar', ['concat', 'minify', 'less']);
