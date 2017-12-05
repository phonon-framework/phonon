import browserify from 'browserify'
import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import browserSync from 'browser-sync'

// configuration
const entryPoint = './src/js/index.js'
const browserDir = './'
const sassWatchPath = './src/scss/**/*.scss'
const jsWatchPath = './src/**/*.js'
const htmlWatchPath = './**/*.html'

gulp.task('js', () => {
  return browserify(entryPoint, {
    debug: true,
    extensions: ['es6']
  })
    .transform('babelify')
    .bundle()
    .pipe(source('phonon.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('sass', () => {
  return gulp.src(sassWatchPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('browser-sync', () => {
  const config = {
    server: { baseDir: browserDir }
  }

  return browserSync(config)
})

gulp.task('watch', () => {
  gulp.watch(jsWatchPath, ['js'])
  gulp.watch(sassWatchPath, ['sass'])
  gulp.watch(htmlWatchPath, () => {
    return gulp.src('')
      .pipe(browserSync.reload({ stream: true }))
  })
})

gulp.task('default', ['watch'])

gulp.task('build', ['js', 'sass'])
