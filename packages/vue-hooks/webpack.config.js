const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ahooks-vue3.js',
    library: 'AhooksVue3',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                '@babel/preset-typescript'
              ]
            }
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  optimization: {
    minimize: true,
  },
};
