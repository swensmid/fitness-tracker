import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useEffect } from "react";
import * as Font from "expo-font";
import { Text, View } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import { UserProvider } from "./components/UserContext";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}
const Tab = createBottomTabNavigator();

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

  }, []);

  const [loaded] = Font.useFonts({
    Montserrat: require("./assets/fonts/MontserratBlack.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
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
      </UserProvider>
    </PaperProvider>
  );
}
