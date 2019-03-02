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

function buildjs() {
    return src('src/core/**/*.js')
    .pipe(src('src/addons/**/*.js'))
    .pipe(concat('el.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(dest('dist/'));
}

exports.clean = clean;
exports.build = series(clean, buildjs);
exports.default = exports.build;