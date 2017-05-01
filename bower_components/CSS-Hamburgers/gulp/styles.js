'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var project = require('../package.json');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var gzip = require('gulp-gzip');

var styleInjector = function (isBuild) {

    var sourceFiles;
    var sassOptions = {
        style: 'expanded'
    };

    if (isBuild) {

        sourceFiles = [
            path.join(conf.paths.src, '/app/**/*.scss'),
            path.join('!' + conf.paths.src, '/app/**/demo/*.scss'),
            path.join('!' + conf.paths.src, '/app/index.scss')
        ];
    } else {

        sourceFiles = [
            path.join(conf.paths.src, '/app/**/*.scss'),
            path.join('!' + conf.paths.src, '/app/index.scss')
        ];
    }
    var injectFiles = gulp.src(sourceFiles, {
        read: false
    });

    var injectOptions = {
        transform: function (filePath) {
            filePath = filePath.replace(conf.paths.src + '/app/', '');
            return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
    };

  if(isBuild) {

    var cssFilter = $.filter('**/*.css', {

        restore: true
    });


    return gulp.src([
            path.join(conf.paths.src, '/app/index.scss')
        ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe($.rename(function (_path) {
            _path.basename = project.name.toLowerCase();
            _path.extname = '.scss';
        }))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/app/')))
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe(cssFilter)
        .pipe($.sourcemaps.init())
        .pipe($.minifyCss({
            processImport: false
        }))
        .pipe($.sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe($.rename(function (_path) {
            _path.basename = project.name.toLowerCase() + '.min';
            _path.extname = '.css';
        }))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.rename(function (_path) {
            _path.basename = project.name.toLowerCase();
            _path.extname = '.css';
        }))
        .pipe(gzip())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
  } else {

    return gulp.src([
            path.join(conf.paths.src, '/app/index.scss')
        ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
        .pipe(browserSync.reload({
        stream: true
    }));
  }
};

gulp.task('copyScss', function () {

    var fileFilter = $.filter(function (file) {

        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/**/*.scss'),
        path.join('!' + conf.paths.src, '/app/**/demo/*.scss'),
        path.join('!' + conf.paths.src, '/app/index.scss')
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('styles', function () {

    styleInjector();
});

gulp.task('styles:build', ['copyScss'], function () {

    styleInjector(true);
});

