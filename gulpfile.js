// https://github.com/philhawksworth/hawksworx.com/blob/e359bc4fd55d96f01ab90f19dae721536f17225f/gulpfile.js

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('css', function() {
  return gulp.src('./src/_includes/assets/inline.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest('./src/_includes/assets'));
});

gulp.task('watch', function() {
  gulp.watch('./src/_includes/assets/inline.scss', gulp.parallel('css'));
});
