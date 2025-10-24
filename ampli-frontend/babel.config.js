module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@assets': './assets',
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
            '.png',
            '.jpg',
            '.jpeg',
          ],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
