var path = require('path');
var gulp = require('gulp');
var babel = require("gulp-babel");


gulp.task('build', function() {
  var source = path.resolve(__dirname, './src/index.js');
  var output = path.resolve(__dirname, './dist/');

  gulp.src(source)
    .pipe(babel())
    .pipe(gulp.dest(output))
});
