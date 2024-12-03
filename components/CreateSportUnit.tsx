import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import "setimmediate";
import React, { useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";

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
