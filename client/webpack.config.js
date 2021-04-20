const path = require("path");

module.exports = {
  mode: "production",
  context: __dirname,
  entry: `./src/client.js`,
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: `client.js`,
  },
  resolve: {
    extensions: [".js"],
  },
  target: "node",
  module: {},
  externals: []
};
