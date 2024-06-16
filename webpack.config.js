const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    resolve: {
      fallback: { 
        "url": require.resolve("url/"),
        "stream" : require.resolve("stream/"),
        "os": require.resolve("os/"),
        "net": require.resolve("net/"),
        "tls": require.resolve("tls/"),
        }
    },
    "devServer": {
      "historyApiFallback": true,
      "proxy": {
        "/api": {
          "target" : "http://localhost:3000",
          "secure": false
        }
      }
    },
    plugins: [
        new NodePolyfillPlugin(),
    ],
  };