const path = require("path");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env", "@babel/react"]
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  mode: devMode ? "development" : "production",
  watch: devMode,
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false
  }
};
