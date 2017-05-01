'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

gulp.task('build', ['styles:build']);
