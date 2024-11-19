import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import * as Font from "expo-font";
import { Text, View } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import 'setimmediate';

import { setupDatabase } from './components/Database/SQLite';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}
const Tab = createBottomTabNavigator();

// Delete this if Summary Screen is Created
const SummaryScreen = () => (
  <View>
    <Text>Home Screen</Text>
  </View>
);

// Delete this if Weight Screen is Created
const WeightScreen = () => (
  <View>
    <Text>Sports Unit Screen</Text>
  </View>
);

// Delete this if Foods is Created
const FoodsScreen = () => (
  <View>
    <Text>Calendar Screen</Text>
  </View>
);

// Delete this if Profile Screen is Created
const ProfileScreen = () => (
  <View>
    <Text>Profile Screen</Text>
  </View>
);


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A5A41",
    secondary: "#EAE7E7",
  },
};


export default function App() {
  useEffect(() => {

    const initializeDatabase = async () => {
      try {

        await setupDatabase();
      } catch (error) {
        console.error('Failed:', error)
      }
    };
    initializeDatabase();
  }, []);

  const [loaded] = Font.useFonts({
    Montserrat: require("./assets/fonts/MontserratBlack.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
          }}
        >
          <Tab.Screen
            name="Summary"
            component={SummaryScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons name="basketball" size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Weight"
            component={WeightScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons name="chart-line-variant" size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Foods"
            component={FoodsScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons name="food" size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Profil"
            component={ProfileScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons name="account" size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

