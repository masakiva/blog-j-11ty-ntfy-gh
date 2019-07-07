'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

const buildSrc = "src";
const buildDest = "dist";


gulp.task('css', function() {
  return gulp.src(buildSrc + '/_includes/assets/inline.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest(buildSrc + '/_includes/assets'));
});

gulp.task('watch', function() {
  gulp.watch(buildSrc + '/_includes/assets/inline.scss', gulp.parallel('css'));
});
