// https://github.com/philhawksworth/hawksworx.com/blob/e359bc4fd55d96f01ab90f19dae721536f17225f/gulpfile.js

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const serve = require('gulp-serve');
const shell = require('gulp-shell');
const del = require('del');
const request = require('request');
const fs = require('fs');
const concat = require('gulp-concat');
const config = require('dotenv').config();

const buildSrc = "src";
const buildDest = "dist";


/* cleanup the build output */
gulp.task('clean-build', function () {
  return del(buildDest + '/**/*');
});

/* local webserver for development */
gulp.task('serve', serve({
  root: [buildDest],
  port: 8008
}));

gulp.task('css', function() {
  return gulp.src(buildSrc + '/_includes/assets/inline.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest(buildSrc + '/_includes/assets'));
});

gulp.task('watch-css', function() {
  gulp.watch(buildSrc + '/_includes/assets/inline.scss', gulp.parallel('css'));
});

/*
  simplest possible noddy js management
*/
gulp.task("js", function () {
  return gulp.src(buildSrc + "/js/**/*.js")
    .pipe(concat('jamstack-comments.js'))
    .pipe(gulp.dest(buildDest + '/js'))
});


/*
  Check if we need to help the developer setup the Netlify environment variables
*/
gulp.task('check-init', function (done) {

  // Look for the environment variables
  if(process.env.APPROVED_COMMENTS_FORM_ID && process.env.API_AUTH && process.env.SLACK_WEBHOOK_URL && process.env.URL ) {

    // Automatically detect and set the comments queue form environment variable.
    var siteDomain = process.env.URL.split("://")[1];
    var url = `https://api.netlify.com/api/v1/sites/${siteDomain}/forms/?access_token=${process.env.API_AUTH}`;

    // REFACTOR: do this conditionally.. not for every build after envs are init'd
    request(url, function(err, response, body){
      if(!err && response.statusCode === 200){
        var body = JSON.parse(body);
        var approvedForm = body.filter(function(f){
          return f.name == 'approved-comments';
        });
        var initStatus = {
          'environment' : true,
          'approved_form_id' : approvedForm[0].id,
          'rootURL' :  process.env.URL,
          'siteName' : siteDomain.replace('.netlify.com', '')
        };
        saveInitStatus(initStatus);
        done();
      } else {
        console.log("Couldn't detect a APPROVED_FORM from the API");
        done();
      }
    });
  } else {
    var initStatus = {"environment" : false};
    saveInitStatus(initStatus);
    done();
  }


});



/*
  save the status of our environment somewhere that our SSG can access it
*/
function saveInitStatus(initStatus) {
  fs.writeFile(buildSrc + "/_data/init.json", JSON.stringify(initStatus), function(err) {
    if(err) {
      console.log(err);
    }
  });
}



gulp.task('generate', shell.task('npx eleventy'));



/*
  Collect and stash comments for the build
*/
gulp.task("get:comments", function (done) {

  // set up our request with appropriate auth token and Form ID
  var url = `https://api.netlify.com/api/v1/forms/${process.env.APPROVED_COMMENTS_FORM_ID}/submissions/?access_token=${process.env.API_AUTH}`;

  // Go and get the data from Netlify's submissions API
  request(url, function(err, response, body){
    if(!err && response.statusCode === 200){
      var body = JSON.parse(body);
      var comments = {};

      // massage the data into the shape we want,
      // and add a gravatar URL if possible
      for(var item in body){
        var data = body[item].data;

        var comment = {
          name: data.name,
          comment: "\n" + data.comment.trim(), // add a newline before the markdown so that 11ty can spot the markdown and interpret it.
          date: body[item].created_at
        };

        // Add it to an existing array or create a new one
        if(comments[data.path]){
          comments[data.path].push(comment);
        } else {
          comments[data.path] = [comment];
        }
      }

      // write our data to a file where our site generator can get it.
      fs.writeFile(buildSrc + "/_data/comments.json", JSON.stringify(comments, null, 2), function(err) {
        if(err) {
          console.log(err);
          done();
        } else {
          console.log("Comments data saved.");
          done();
        }
      });

    } else {
      console.log("Couldn't get comments from Netlify");
      done();
    }
  });
});


gulp.task('watch', function() {
  gulp.watch(buildSrc + '/**/*', gulp.parallel('build:local'));
});

gulp.task('build', gulp.series(
  'get:comments',
  'check-init',
  'generate',
  'css'
));

gulp.task('build:local', gulp.series(
  'generate',
  'css'
));
