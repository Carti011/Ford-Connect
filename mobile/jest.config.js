module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-expo|expo|@expo|expo-router|expo-secure-store|expo-modules-core|react-native|@react-native|@react-navigation)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.test.{ts,tsx}',
  ],
};
