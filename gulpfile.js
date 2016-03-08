var gulp         = require('gulp');
var stylus       = require('gulp-stylus');
var cssnano 	 = require('gulp-cssnano');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

gulp.task('default', ['build'])

gulp.task('build', [
	'js-core',
	'js-all',
	'js-components',
	'css-base',
	'css-theme',
	'css-all',
	'css-components',
	'fonts'
]);

/**
 * Build Phonon core
*/
gulp.task('js-core', function() {
	return gulp.src([
		'./src/js/core/wrap/prefix.js',
		'./src/js/core/ready.js',
		'./src/js/core/polyfills.js',
		'./src/js/core/device.js',
		'./src/js/core/browser.js',
		'./src/js/core/ajax.js',
		'./src/js/core/events.js',
		'./src/js/core/tagmanager.js',
		'./src/js/core/public.js',
		'./src/js/core/wrap/suffix.js',
		'./src/js/core/i18n.js',
		'./src/js/core/navigator.js',
	]).pipe(concat('phonon-core.js'))
	.pipe(gulp.dest('./dist/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'));
});

/**
 * Build all together
*/
gulp.task('js-all', function() {
	return gulp.src([
		'./dist/js/phonon-core.js',
		'./src/js/ui/*.js',
	]).pipe(concat('phonon.js'))
	.pipe(gulp.dest('./dist/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'));
});

/**
 * Build each JS component
*/
gulp.task('js-components', function () {
	return gulp.src('./src/js/ui/*.js')
	.pipe(gulp.dest('./dist/js/components'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js/components'));
});

/**
 * Build the CSS base
*/
gulp.task('css-base', function () {
	return gulp.src('./src/stylus/phonon-base.styl')
	.pipe(stylus({compress: false, keepSpecialComments: 1}))
	.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', 'ios 6', 'ios 7', 'ie 8', 'ie 9', 'android 4'] }) ]))
	.pipe(gulp.dest('./dist/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(cssnano({zindex: false}))
	.pipe(gulp.dest('./dist/css'));
});

/**
 * Build the CSS theme
*/
gulp.task('css-theme', function () {
	return gulp.src('./src/stylus/theme.styl')
	.pipe(stylus({compress: false}))
	.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', 'ios 6', 'ios 7', 'ie 8', 'ie 9', 'android 4'] }) ]))
	.pipe(gulp.dest('./dist/css'));
});

/**
 * Build the full CSS
*/
gulp.task('css-all', function () {
	return gulp.src('./src/stylus/phonon.styl')
	.pipe(stylus({compress: false}))
	.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', 'ios 6', 'ios 7', 'ie 8', 'ie 9', 'android 4'] }) ]))
	.pipe(gulp.dest('./dist/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(cssnano({zindex: false}))
	.pipe(gulp.dest('./dist/css'));
});

gulp.task('css-components', function () {
	return gulp.src('./src/stylus/components/*.styl')
	.pipe(stylus({compress: false}))
	.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', 'ios 6', 'ios 7', 'ie 8', 'ie 9', 'android 4'] }) ]))
	.pipe(gulp.dest('./dist/css/components'))
	.pipe(rename({suffix: '.min'}))
	.pipe(cssnano({zindex: false}))
	.pipe(gulp.dest('./dist/css/components'));
});

gulp.task('fonts', function () {
	return gulp.src('./src/fonts/**/*')
	.pipe(gulp.dest('./dist/fonts'));
});
