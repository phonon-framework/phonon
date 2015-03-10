var gulp = require('gulp');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var minify = require('gulp-minify');
var babel = require('gulp-babel');
var rename = rename = require('gulp-rename');
// var watch = require('gulp-watch');
var jshint = require('gulp-jshint');

gulp.task('default', ['styles', 'min-styles', 'scripts', 'fonts'], function() { });

gulp.task('styles', function () {
	return gulp.src('./src/less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('min-styles', function () {
	return gulp.src('./dist/css/**/*.css')
		.pipe(cssmin().on('error', function(err) {
			console.log(err);
		}))
		.pipe(rename({suffix: '-min'}))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', function () {
	return gulp.src('./src/js/**/*.js')
		.pipe(babel())
		.pipe(minify())
		.pipe(gulp.dest('./dist/js'));	
});

gulp.task('fonts', function () {
	return gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('jshint', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
