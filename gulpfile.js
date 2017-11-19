const gulp               = require('gulp')
const browserSync        = require('browser-sync').create()
const sass               = require('gulp-sass')
const reload             = browserSync.reload
const gutil              = require('gulp-util')
const autoprefixer       = require('gulp-autoprefixer')
const webpack            = require('gulp-webpack')

const src = {
  scss: 'src/scss/*.scss',
  css: 'dist/css',
  js: 'dist/js',
  test: 'test'
}

// Static Server + watching scss files
gulp.task('serve', ['sass'], () => {
  browserSync.init({
    // server: ['test', 'dist'],
    proxy: 'localhost:80',
    open: false
  })

  gulp.watch(src.scss, ['sass'])
  gulp.watch('src/js/**/*.js', ['script'])
})

gulp.task('script', function () {
  return gulp.src('src/js/phonon.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./'))
    .pipe(reload({ stream: true }))
})

// Compile sass into CSS
gulp.task('sass', () => {
  gutil.log(gutil.colors.magenta('Sass to CSS'))
  return gulp.src('src/scss/phonon.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(src.css))
    .pipe(reload({ stream: true }))
    // .pipe(reload({ stream: true }))
})

gulp.task('default', ['serve'])
