module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '16',
          browsers: ['> 1%', 'last 2 versions', 'not dead'],
        },
        modules: false,
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
  ],
  env: {
    cjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '16',
              browsers: ['> 1%', 'last 2 versions', 'not dead'],
            },
            modules: 'cjs',
          },
        ],
        '@babel/preset-typescript',
      ],
    },
  },
};
