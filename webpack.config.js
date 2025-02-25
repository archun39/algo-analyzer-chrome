const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    background: './src/background.ts',
    contentScript: './src/contentScript.ts',
    popup: './src/popup/popup.ts'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "popup", "popup.html"),
          to: "popup.html"
        },
        // assets 폴더가 있다면 함께 복사 (없다면 생략)
        {
          from: path.resolve(__dirname, "assets"),
          to: "assets"
        }
      ]
    })
  ]
};