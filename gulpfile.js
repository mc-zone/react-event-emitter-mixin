var path = require('path');
var gulp = require('gulp');
var babel = require("gulp-babel");
var rename = require("gulp-rename");


gulp.task('default', function() {
  var source = path.resolve(__dirname, './src/index.js');
  var output = path.resolve(__dirname, './');

  gulp.src(source)
    .pipe(babel())
    .pipe(rename('EventEmitterMixin.js'))
    .pipe(gulp.dest(output))
});
