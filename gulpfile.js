const gulp = require('gulp');

const pug = require('gulp-pug');
const scss = require('gulp-sass');

const autoprefixer = require('gulp-autoprefixer');

const sourcemaps = require('gulp-sourcemaps');

const babel = require('gulp-babel');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

const bs = require('browser-sync').create();

const del = require('del');

gulp.task('del', () => {
  return del('build/*');
});

gulp.task('html:build', () => {
  return gulp.src('src/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('build/'));
});

gulp.task('css:build', () => {
  return gulp.src('src/static/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
          browsers: ['last 2 versions']
        }))
        .pipe(rename('custom.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/'));
});

gulp.task('js:build', () => {
  return gulp.src('src/static/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('custom.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/'));
});

gulp.task('image:optimizate', () => {
  return gulp.src('src/static/img/**/**/*')
        .pipe(gulp.dest('build/img/'));
});

gulp.task('watch', () => {
  gulp.watch('src/pug/' + '**/**/*.pug', gulp.series('html:build'));
  gulp.watch('src/static/scss/' + '**/**/*.scss', gulp.series('css:build'));
  gulp.watch('src/static/js/' + '*.js', gulp.series('js:build'));
  gulp.watch('src/static/img/' + '**/**/*', gulp.series('image:optimizate'));
});

gulp.task('serve', () => {
  bs.init({ server: 'build/'});
  gulp.watch('build' + '/**/**/*.*').on('change', bs.reload);    
});

gulp.task('build',
   gulp.series('del', 'image:optimizate', 'js:build', 'css:build', 'html:build'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));