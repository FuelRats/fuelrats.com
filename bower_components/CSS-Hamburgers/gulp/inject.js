'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var $ = require('gulp-load-plugins')();

gulp.task('inject', ['styles', 'assets'], function () {

    var injectStyles = gulp.src([
            path.join(conf.paths.tmp, '/serve/app/index.css'),
            path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
        ], { read: false });

    var injectOptions = {
      ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/index.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
