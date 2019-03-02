/*jshint esversion: 6 */ 

const {series, src, dest} = require('gulp');
const uglify = require('gulp-uglify');
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
    .pipe(dest('dist/'));
}

exports.clean = clean;
exports.build = series(clean, buildjs);
exports.default = exports.build;