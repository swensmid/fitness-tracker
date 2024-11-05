import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { setupDatabase } from "./components/Database/SQLite";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import * as Font from "expo-font";
import { PaperProvider } from "react-native-paper";
import { InputField } from "./atoms/InputField";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "./molecules/Header";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

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

  const [currentDate, setCurrentDate] = useState(getDate());

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <PaperProvider>
          <View style={styles.container}>
            <Header minor={currentDate} middle="Activity" major="Summary" />

            <InputField
              label="Name"
              value=""
              onChangeText={() => {}}
              placeholder="Your name"
            />

            <StatusBar style="auto" />
          </View>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
