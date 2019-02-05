/*jshint esversion: 6 */ 

const package = require('./package.json');
const {parallel, series, src, dest} = require('gulp');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');

function clean(cb) {
    del(['dist/*']).then(function() {
        cb();
    });
}

function buildjs(cb) {
    return src('src/js/core/**/*.js')
    .pipe(src('src/js/addons/**/*.js'))
    .pipe(concat('el.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(dest('dist/' + package.version + '/'));
}

function buildcss(cb) {
    return src('src/css/**/*.css')
    .pipe(concat('el.css'))
    .pipe(uglifycss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(dest('dist/' + package.version + '/'));
}

exports.clean = clean;
exports.build = parallel(buildjs);
exports.default = exports.build;