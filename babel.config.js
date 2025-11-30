module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // O plugin do Reanimated/Worklets deve ser sempre o último da lista
      'react-native-worklets/plugin',
    ],
  };
};