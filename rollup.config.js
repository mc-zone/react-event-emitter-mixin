var path = require("path");
var babel = require("rollup-plugin-babel");

module.exports = {
  entry: 'src/index.js',
  format: 'umd',
  dest: path.resolve(__dirname, 'dist/index.js'),
  plugins:[
    babel({
      exclude: 'node_modules/**'
    }) 
  ]
}
