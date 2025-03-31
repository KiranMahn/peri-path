jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('@expo/vector-icons', () => {
    return {
      Ionicons: ({ name, size, color }) => `Ionicon-${name}-${size}-${color}`,
    };
});
jest.mock("expo-font");