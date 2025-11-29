module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
    plugins: ['react-native-reanimated/plugin'],
  };
};
=======
    // Adicione esta linha de plugins
    plugins: ['react-native-reanimated/plugin'],
  };
};
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
