const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  target: "electron-main",
  entry: path.resolve(__dirname, "electron", "main.ts"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist-electron"),
  },
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.electron.json",
            },
          },
        ],
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [new Dotenv()],
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "node_modules")],
    plugins: [
      new TsconfigPathsPlugin({ configFile: "tsconfig.electron.json" }),
    ],
    extensions: [".tsx", ".ts", ".js"],
  },
};
