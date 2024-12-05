import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import "setimmediate";
import React, { useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TitleMiddle } from "../atoms/TitleMiddle";
import { TitleMajor } from "../atoms/TitleMajor";
import { ScrollView } from "react-native";
import { InputField } from "../atoms/InputField";
import { KeyboardAvoidingView } from 'react-native';

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

export default function CreateSportUnit() {
  // Inputs
  const [activityValue, setActivityValue] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [inputError, setInputError] = useState(true);

  // Activities
  const [selectedActivity, setSelectedActivity] = useState("");
  const activities = [
    { name: "Walking", icon: "walk" },
    { name: "Running", icon: "run" },
    { name: "Swimming", icon: "swim" },
    { name: "Biking", icon: "bike" },
  ];

  const handleSave = () => {
    const distanceNumber = parseFloat(distanceValue);
    const durationNumber = parseFloat(durationValue);

    if (
      !isNaN(distanceNumber) &&
      !isNaN(durationNumber) &&
      activityValue !== ""
    ) {
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
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

        {/* TODO: Maybe make scrollable view or keyboard avoiding view */}
        {selectedActivity !== "" && (
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              padding: 20,
            }}
          >
            <InputField
              label="Distance (km)"
              placeholder="e.g. 10.5"
              value={distanceValue}
              onChangeText={(text) => setDistanceValue(text)}
              //error={inputError}
            />
            <InputField
              label="Duration (min)"
              placeholder="e.g. 45"
              value={durationValue}
              onChangeText={(text) => setDurationValue(text)}
              //error={inputError}
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
        )}
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
