'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

const buildSrc = "src";
const buildDest = "dist";


gulp.task('css', function() {
  return gulp.src(buildSrc + '/includes/assets/inline.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest(buildSrc + '/includes/assets'));
});

gulp.task('watch', function() {
  gulp.watch(buildSrc + '/includes/assets/inline.scss', gulp.parallel('css'));
});
