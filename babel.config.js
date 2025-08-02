module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Adicione esta linha de plugins
    plugins: ['react-native-reanimated/plugin'],
  };
};