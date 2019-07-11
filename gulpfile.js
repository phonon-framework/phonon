const gulp         = require('gulp');
const stylus       = require('gulp-stylus');
const cssnano 	 = require('cssnano');
const rename       = require('gulp-rename');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const nodeModules = './node_modules/'

const processors = [
	autoprefixer(),
];

/**
 * Build Phonon core
*/
function jsCore() {
	return gulp.src([
		nodeModules + 'platform/platform.js',
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
	.pipe(uglify().on('error', function(e) {
    	console.log(e);
    }))
	.pipe(gulp.dest('./dist/js'));
}

/**
 * Build all together
*/
function jsAll() {
	return gulp.src([
		'./dist/js/phonon-core.js',
		'./src/js/ui/*.js',
	]).pipe(concat('phonon.js'))
	.pipe(gulp.dest('./dist/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify().on('error', function(e) {
    	console.log(e);
    }))
	.pipe(gulp.dest('./dist/js'));
}

/**
 * Build each JS component
*/
function javascriptComponents() {
	return gulp.src(['./src/js/ui/*.js', nodeModules + 'awesomplete/awesomplete.js'])
	.pipe(gulp.dest('./dist/js/components'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify().on('error', function(e) {
    	console.log(e);
    }))
	.pipe(gulp.dest('./dist/js/components'));
}

/**
 * Build the CSS base
*/
function cssBase() {
	return gulp.src('./src/stylus/phonon-base.styl')
	.pipe(stylus({compress: false, keepSpecialComments: 1}))
	.pipe(postcss(processors))
	.pipe(gulp.dest('./dist/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(postcss([...processors, cssnano({zindex: false})]))
	.pipe(gulp.dest('./dist/css'));
};

/**
 * Build the CSS theme
*/
function cssTheme() {
	return gulp.src('./src/stylus/theme.styl')
	.pipe(stylus({compress: false}))
	.pipe(postcss(processors))
	.pipe(gulp.dest('./dist/css'));
}

/**
 * Build the full CSS
*/
function cssAll() {
	return gulp.src('./src/stylus/phonon.styl')
	.pipe(stylus({compress: false}))
	.pipe(postcss(processors))
	.pipe(gulp.dest('./dist/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(postcss([...processors, cssnano({zindex: false})]))
	.pipe(gulp.dest('./dist/css'));
}

function cssComponents() {
	return gulp.src('./src/stylus/components/*.styl')
	.pipe(stylus({compress: false}))
	.pipe(postcss([ autoprefixer() ]))
	.pipe(gulp.dest('./dist/css/components'))
	.pipe(rename({suffix: '.min'}))
	.pipe(postcss([...processors, cssnano({zindex: false})]))
	.pipe(gulp.dest('./dist/css/components'));
}

function fonts() {
	return gulp.src('./src/fonts/**/*')
	.pipe(gulp.dest('./dist/fonts'));
}

const build = gulp.series(jsCore, jsAll, javascriptComponents, cssBase, cssTheme, cssAll, cssComponents, fonts);

// export tasks
exports['js-core'] = jsCore;
exports['js-all'] = jsAll;
exports['js-components'] = javascriptComponents;
exports['css-base'] = cssBase;
exports['css-theme'] = cssTheme;
exports['css-all'] = cssAll;
exports['css-components'] = cssComponents;
exports.fonts = fonts;
exports.build = build;
exports.default = build;
