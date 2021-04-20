const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  name: "server",
  mode: "production",
  context: __dirname,
  entry: `./src/server.js`,
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: `server.js`,
  },
  resolve: {
    extensions: [".js"],
  },
  target: "node",
  module: {},
  externals : [nodeExternals()]
};
