import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import "setimmediate";
import React, { useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A5A41",
    secondary: "#EAE7E7",
  },
};

export default function CreateSportUnit() {
  // Inputs
  const [activityValue, setActivityValue] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [inputError, setInputError] = useState(true);

  // Activities
  const [selectedActivity, setSelectedActivity] = useState("");
  const activities = [
    { name: "walking", icon: "walk" },
    { name: "running", icon: "run" },
    { name: "swimming", icon: "swim" },
    { name: "biking", icon: "bike" },
  ];

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
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text>Sport Unit Screen</Text>
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.name}
            onPress={() => setSelectedActivity(activity.name)}
            style={{
              margin: 10,
              backgroundColor:
                selectedActivity === activity.name ? "#1A5A41" : "#EAE7E7",
              borderRadius: 50,
              padding: 10,
            }}
          >
            <MaterialCommunityIcons
              name={activity.icon}
              size={36}
              color={selectedActivity === activity.name ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        ))}
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
