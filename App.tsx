import React from "react";
import { useEffect } from "react";
import { View } from "react-native";
import { setupDatabase } from "./components/Database/SQLite";
import * as Font from "expo-font";
import { Text } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import "setimmediate";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import WeightScreen from "./components/WeightScreen";
import FoodsScreen from "./components/FoodScreen";
import { UserProvider } from "./components/UserContext";
import CreateSportUnit from "./components/CreateSportUnit";
const Tab = createBottomTabNavigator();

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
                console.error("Failed:", error);
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
                                    <MaterialCommunityIcons
                                        name="basketball"
                                        size={26}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="CreateSportUnit"
                            component={CreateSportUnit}
                            options={{
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons
                                        name="plus"
                                        size={26}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Weight"
                            component={WeightScreen}
                            options={{
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons
                                        name="chart-line-variant"
                                        size={26}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Foods"
                            component={FoodsScreen}
                            options={{
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons
                                        name="food"
                                        size={26}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profil"
                            component={ProfileScreen}
                            options={{
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons
                                        name="account"
                                        size={26}
                                    />
                                ),
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </UserProvider>
        </PaperProvider>
    );
}
