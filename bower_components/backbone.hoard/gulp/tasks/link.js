'use strict';

var gulp = require('gulp');
var execFile = require('child_process').execFile
var util = require('util');

gulp.task('link', function (done) {
  var srcDir = process.env.PWD;
  var cmd = util.format('ln -s -f %s/src %s/node_modules', srcDir, srcDir);
  var nodeModules = srcDir + '/node_modules';
  execFile('ln', ['-s', '-f', srcDir + '/src', nodeModules], function () {
    console.log(cmd);
    execFile('ln', ['-s', '-f', srcDir + '/recipe', nodeModules], function () {
      cmd = util.format('ln -s -f %s/recipe %s/node_modules', srcDir, srcDir);
      console.log(cmd);
      done();
    });
  });
});
