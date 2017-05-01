'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var $ = require('gulp-load-plugins')({

    pattern: ['gulp-*', 'del']
});

gulp.task('clean', function (cb) {

    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});
