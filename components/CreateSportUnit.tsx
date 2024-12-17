import React = require("react");
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import "setimmediate";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TitleMiddle } from "../atoms/TitleMiddle";
import { TitleMajor } from "../atoms/TitleMajor";
import { ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
// TODO: fix import { useUser } from "../context/UserContext";

function getDate() {
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}, ${month} ${year}`;
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A5A41",
    secondary: "#EAE7E7",
  },
};

const calculateCalories = (
  activity: string,
  distance: number,
  time: number,
  weightNumber: number
) => {
  const avgSpeed = distance / (time / 60);
  const met = getMETForActivity(activity, avgSpeed);

  return met * weightNumber * (time / 60);
};

const getMETForActivity = (activity: any, avgSpeed: number) => {
  switch (activity) {
    case "Running":
      if (12 <= avgSpeed) return 11.5;
      if (10 <= avgSpeed) return 10;
      if (8 <= avgSpeed) return 8.3;
      if (6.5 <= avgSpeed) return 5;
      if (5 <= avgSpeed) return 3.8;
      return 0;
    case "Walking":
      if (6.5 <= avgSpeed) return 5;
      if (5 <= avgSpeed) return 3.8;
      if (3 <= avgSpeed) return 2.3;
      return 0;
    case "Swimming":
      if (5 <= avgSpeed) return 8;
      if (0 < avgSpeed) return 6;
      return 0;
    case "Biking":
      if (22 <= avgSpeed) return 10;
      if (19 <= avgSpeed) return 8;
      if (16 <= avgSpeed) return 6;
      return 0;
    default:
      return 0;
  }
};

export default function CreateSportUnit() {
  // TODO: fix const {user, setCalories} = useUser();
  const [inputError, setInputError] = useState(true);
  // Inputs
  const [distanceValue, setDistanceValue] = useState("");
  const [durationValue, setDurationValue] = useState("");
  // Activities
  const [selectedActivity, setSelectedActivity] = useState("");
  const activities = [
    { name: "Running", icon: "run" },
    { name: "Walking", icon: "walk" },
    { name: "Swimming", icon: "swim" },
    { name: "Biking", icon: "bike" },
  ];

  const handleSave = () => {
    const distanceNumber = parseFloat(distanceValue);
    const durationNumber = parseFloat(durationValue);
    // TODO: fix const weightNumber = user.weight;

    if (
      !isNaN(distanceNumber) &&
      !isNaN(durationNumber) &&
      selectedActivity !== ""
    ) {
      setInputError(false);
      const calculatedCalories = calculateCalories(
        selectedActivity,
        distanceNumber,
        durationNumber,
        // TODO: fix weightNumber 
        // 0 is temporary fix for needing 4 params
        0|| 0
      );
      // TODO: fix setCalories(previousCalories => previousCalories + calculatedCalories);
    } else {
      setInputError(true);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{
          flex: 1,
          flexDirection: "column",
          margin: 20,
        }}
      >
        <Text>{getDate()}</Text>
        <TitleMajor text="Log New" />
        <TitleMiddle text="Activity" />
        <View style={{ marginTop: 20 }}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.name}
              onPress={() => setSelectedActivity(activity.name)}
              style={{
                flexDirection: "row",
                alignItems: "center",
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
              <View key={activity.name}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: selectedActivity === activity.name ? "#fff" : "#000",
                  }}
                >
                  {activity.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            padding: 20,
          }}
        >
          <TextInput
            style={{ marginBottom: 20 }}
            mode="outlined"
            keyboardType="numeric"
            label="Distance (km)"
            value={distanceValue}
            placeholder="e.g. 10.5"
            onChangeText={setDistanceValue}
          />
          <TextInput
            style={{ marginBottom: 20 }}
            mode="outlined"
            keyboardType="numeric"
            label="Duration (min)"
            value={distanceValue}
            placeholder="e.g. 45"
            onChangeText={setDurationValue}
          />
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: "#1A5A41",
              padding: 10,
              borderRadius: 10,
              width: "100%",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
