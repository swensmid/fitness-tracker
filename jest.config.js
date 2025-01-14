module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {
        "\\.[jt]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "expo-sqlite": "<rootDir>/mocks/expo-sqlite.js",
    },
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|@react-native|@react-native-community|expo|@expo-google-fonts|react-navigation|@react-navigation|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-paper)/)",
    ],
};
