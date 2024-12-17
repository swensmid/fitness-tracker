import React = require("react");
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TitleMiddle } from "../atoms/TitleMiddle";
import { TitleMajor } from "../atoms/TitleMajor";
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

/**
 * Calculates the amount of calories burned in a given activity.
 * @function
 * @param {string} activity The type of activity.
 * @param {number} distance The distance of the activity in kilometers.
 * @param {number} time The duration of the activity in minutes.
 * @param {number} weightNumber The weight of the user in kilograms.
 * @return {number} The amount of calories burned.
 */
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

/**
 * Calculates MET (Metabolic Equivalent of Task) for a given activity and average speed.
 * The MET values are based on data from the Compendium of Physical Activities.
 * @param {string} activity - The activity to calculate MET for. Must be one of "Running", "Walking", "Swimming", "Biking".
 * @param {number} avgSpeed - The average speed of the activity in kilometers per hour.
 * @returns {number} The MET value for the given activity and average speed.
 */
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

/**
 * CreateSportUnit component allows users to log new sport activities.
 * Users can input activity details such as distance, duration, and description.
 * The component calculates calories burned based on the input and selected activity.
 * 
 * @component
 * @returns {JSX.Element} A view allowing the user to log a new sport activity.
 */
export default function CreateSportUnit() {
  // TODO: fix const {user, setCalories} = useUser();
  const [inputError, setInputError] = useState(true);
  // Inputs
  const [distanceValue, setDistanceValue] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  // Activities
  const [selectedActivity, setSelectedActivity] = useState("");
  const activities = [
    { name: "Running", icon: "run" },
    { name: "Walking", icon: "walk" },
    { name: "Swimming", icon: "swim" },
    { name: "Biking", icon: "bike" },
  ];

/**
 * Validates all inputs and saves a new sport unit to the database.
 * @function
 * @param {void} None
 * @return {void} None
 */
  const handleSave = () => {
    const distanceNumber = parseFloat(distanceValue);
    const durationNumber = parseFloat(durationValue);
    // TODO: fix const weightNumber = user.weight;

    if (
      !isNaN(distanceNumber) &&
      !isNaN(durationNumber) &&
      selectedActivity !== "" &&
      descriptionValue !== ""
    ) {
      setInputError(false);
      const calculatedCalories = calculateCalories(
        selectedActivity,
        distanceNumber,
        durationNumber,
        // TODO: fix weightNumber
        // 0 is temporary fix for needing 4 params
        0 || 0
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
            onChangeText={(distanceValue) => setDistanceValue(distanceValue)}
            // TODO: fix error={inputError}
          />
          <TextInput
            style={{ marginBottom: 20 }}
            mode="outlined"
            keyboardType="numeric"
            label="Duration (min)"
            value={durationValue}
            placeholder="e.g. 45"
            onChangeText={(durationValue) => setDurationValue(durationValue)}
            // TODO: fix error={inputError}
          />
          <TextInput
            style={{ marginBottom: 20 }}
            mode="outlined"
            keyboardType="default"
            label="Description"
            value={descriptionValue}
            placeholder="e.g. Morning run with John"
            onChangeText={(descriptionValue) => setDescriptionValue(descriptionValue)}
            // TODO: fix error={inputError}
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
