import { useEffect } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import "setimmediate";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { DefaultTheme, PaperProvider, RadioButton } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A5A41",
    secondary: "#EAE7E7",
  },
};

export default function CreateSportUnit() {
  const [activityValue, setActivityValue] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [inputError, setInputError] = useState(true);

  const handleSave = () => {
    const distanceNumber = parseFloat(distanceValue);
    const durationNumber = parseFloat(durationValue);

    if (activityValue && distanceValue && durationValue) {
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text>Sport Unit Screen</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Choose Activity: </Text>
          <RadioButton.Group
            onValueChange={(value: any) => setActivityValue(value)}
            value={activityValue}
          >
            <RadioButton.Item label="Swimming" value="swimming" />
            <RadioButton.Item label="Jogging" value="jogging" />
            <RadioButton.Item label="Biking" value="biking" />
            <RadioButton.Item label="Walking" value="walking" />
          </RadioButton.Group>
        </View>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          placeholder="Distance (km)"
          keyboardType="numeric"
          value={distanceValue}
          onChangeText={(text) => setDistanceValue(text)}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          placeholder="Duration (minutes)"
          keyboardType="numeric"
          value={durationValue}
          onChangeText={(text) => setDurationValue(text)}
        />
<Button
  onPress={handleSave}
  disabled={inputError}
  title="Save"
/>
      </View>
    </PaperProvider>
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
