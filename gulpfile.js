import gulp from 'gulp';
import browser from 'browser-sync';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-dart-sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import del from 'del';

// HTML
const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Styles
const styles = () => {
  return gulp.src('source/scss/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Images
const imagesCopy = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(gulp.dest('build/img'));
}

// Copy
const copy = (done) => {
  gulp.src(['source/fonts/**/*.{woff2,woff}', 'source/*.ico', 'source/*.webmanifest'], {base: 'source'})
    .pipe(gulp.dest('build'))
  done();
}

// Clean
const buildClean = () => {
  return del('build');
};

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload
const reload = (done) => {
  browser.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch('source/scss/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

export default gulp.series(
  buildClean,
  copy,
  imagesCopy,
  gulp.parallel(
    styles,
    html,
  ),
  gulp.series(
    server,
    watcher
  )
);
