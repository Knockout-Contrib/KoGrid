/*jshint node: true*/
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var gulpConcat = require('gulp-concat');
var gulpRename = require('gulp-rename');
var gulpHeader = require('gulp-header');
var gulpFooter = require('gulp-footer');
var gulpUglify = require('gulp-uglify');
var gulpJSHint = require('gulp-jshint');
var gulpSourceMaps = require('gulp-sourcemaps');
var gulpMinifyCSS = require('gulp-clean-css');
var gulpQUnit = require('gulp-qunit');
var minifyHtml = require('html-minifier').minify;
var mapStream = require('map-stream');
var path = require('path');

var buildConfig = {
    outputPath: './dist',
    packageInfo: require('./package.json'),
    banner: '/*! KoGrid v<%= pkg.version %> | MIT License */'
};

gulp.task('clean', function(done) {
    gutil.log(gutil.colors.gray('Cleaning output directory', path.resolve(buildConfig.outputPath)));
    del('*', {cwd: buildConfig.outputPath}, done);
});

gulp.task('styles', ['clean'], function() {
    return gulp.src('src/KoGrid.css')
        .pipe(gulpHeader(buildConfig.banner, {pkg: buildConfig.packageInfo}))
        .pipe(gulp.dest(buildConfig.outputPath))
        .pipe(gulpMinifyCSS())
        .pipe(gulpRename('KoGrid.min.css'))
        .pipe(gulp.dest(buildConfig.outputPath));
});

gulp.task('compile', ['styles'], function() {
    var jsEscape = function(file) {
        var name = gutil.replaceExtension(path.basename(file.path), '');

        if (name !== 'aggregateTemplate') {
            name = 'default' + name[0].toUpperCase() + name.substr(1);
        }
        var contents = file.contents.toString('utf8').trim();
        contents = minifyHtml(contents, {
            removeComments: true,
            collapseWhitespace: true
        });
        contents = contents.replace(/(['\\])/g, '\\$1')
            .replace(/[\f]/g, "\\f")
            .replace(/[\b]/g, "\\b")
            .replace(/[\n]/g, "\\n")
            .replace(/[\t]/g, "\\t")
            .replace(/[\r]/g, "\\r")
            .replace(/[\u2028]/g, "\\u2028")
            .replace(/[\u2029]/g, "\\u2029");

        contents = 'window.kg.' + name +
            ' = function() { return \'' +
                    contents +
            '\'; };\n';
        return contents;
    };

    return gulp.src([
        'src/namespace.js',
        'src/constants.js',
        'src/navigation.js',
        'src/utils.js',
        'src/templates/*.html',
        'src/bindingHandlers/*.js',
        'src/classes/*.js'])
        .pipe(mapStream(function(file, cb) {
            if (path.extname(file.path) === '.html') {
                file.contents = new Buffer(jsEscape(file));
            }
            cb(null, file);
        }))
        .pipe(gulpSourceMaps.init())
        .pipe(gulpConcat('KoGrid.js'))
        .pipe(gulpHeader("define(['jquery', 'knockout'], function ($, ko) {\n" + buildConfig.banner + '\n(function(window) {\n\'use strict\';\n\n', {pkg: buildConfig.packageInfo}))
        .pipe(gulpFooter('})(window);\n});'))
        .pipe(gulpJSHint())
        .pipe(gulpJSHint.reporter('jshint-stylish'))
        .pipe(gulp.dest(buildConfig.outputPath))
        .pipe(gulpUglify({preserveComments: 'some'}))
        .pipe(gulpRename('KoGrid.min.js'))
        //.pipe(gulpSourceMaps.write('./', {addComment: true}))
        .pipe(gulp.dest(buildConfig.outputPath));
});

gulp.task('test', ['compile'], function() {
    return gulp.src('test/test-runner.htm')
        .pipe(gulpQUnit());
});

gulp.task('test-ci', ['compile'], function() {
    return gulp.src(['test/test-runner-ko*.htm'])
        .pipe(gulpQUnit());
});

gulp.task('default', ['compile', 'styles', 'test']);
