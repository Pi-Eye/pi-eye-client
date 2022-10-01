const webpack = require('webpack');

// config-overrides.js
module.exports = function override(config, env) {
  // New config, e.g. config.plugins.push...
  if (!config.resolve) config.resolve = {};
  if (!config.resolve.fallback) config.resolve.fallback = {};

  config.resolve.fallback = Object.assign(config.resolve.fallback, {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify")
  })


  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]

  return config;
}