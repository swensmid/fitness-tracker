import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { DefaultTheme, PaperProvider, TextInput, Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TitleMiddle } from "../atoms/TitleMiddle";
import { TitleMajor } from "../atoms/TitleMajor";
import { useUser } from "./UserContext";
import { saveActivity } from "./Database/Scripts";

// Hilfsfunktion zum Formatieren des aktuellen Datums
function getDate() {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}, ${month} ${year}`;
}

const today = new Date().toISOString().split("T")[0];

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#1A5A41",
        secondary: "#EAE7E7",
    },
};

// Bereinigt Benutzereingaben, entfernt HTML/Script-Inhalte
const sanitizeInput = (text: string) => {
    return text.replace(/<[^>]*>?/gm, "").trim();
};

const calculateCalories = (
    activity: string,
    distanceNumber: number,
    durationNumber: number,
    weightNumber: number,
) => {
    const avgSpeedKmh = distanceNumber / (durationNumber / 60);
    const met = getMETForActivity(activity, avgSpeedKmh);
    return met * weightNumber * (durationNumber / 60);
};

const getMETForActivity = (activity: string, avgSpeedKmh: number) => {
    switch (activity) {
        case "Running":
            if (avgSpeedKmh >= 12) return 11.5;
            if (avgSpeedKmh >= 10) return 10;
            if (avgSpeedKmh >= 8) return 8.3;
            if (avgSpeedKmh >= 6.5) return 5;
            if (avgSpeedKmh >= 5) return 3.8;
            return 0;
        case "Walking":
            if (avgSpeedKmh >= 6.5) return 5;
            if (avgSpeedKmh >= 5) return 3.8;
            if (avgSpeedKmh >= 3) return 2.3;
            return 0;
        case "Swimming":
            if (avgSpeedKmh >= 5.5) return 10;
            if (avgSpeedKmh >= 4.0) return 8;
            if (avgSpeedKmh > 0) return 6;
            return 0;
        case "Biking":
            if (avgSpeedKmh >= 22) return 10;
            if (avgSpeedKmh >= 19) return 8;
            if (avgSpeedKmh >= 16) return 6;
            return 0;
        default:
            return 0;
    }
};

export default function CreateSportUnit({ navigation }: any) {
    const { user, getDailyCalories } = useUser();
    const [inputError, setInputError] = useState(true);

    const [distanceValue, setDistanceValue] = useState("");
    const [durationValue, setDurationValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [selectedActivity, setSelectedActivity] = useState("");

    const activities = [
        { name: "Running", icon: "run" },
        { name: "Walking", icon: "walk" },
        { name: "Swimming", icon: "swim" },
        { name: "Biking", icon: "bike" },
    ];

    const clearFields = () => {
        setDistanceValue("");
        setDurationValue("");
        setDescriptionValue("");
        setSelectedActivity("");
        setInputError(false);
    };

    const handleSaveActivity = async () => {
        const distanceNumber = parseFloat(distanceValue);
        const durationNumber = parseFloat(durationValue);
        const weightNumber = user.weight;
        const sanitizedDescription = sanitizeInput(descriptionValue);
        const validActivities = ["Running", "Walking", "Swimming", "Biking"];

        if (
            !isNaN(distanceNumber) &&
            !isNaN(durationNumber) &&
            sanitizedDescription &&
            validActivities.includes(selectedActivity)
        ) {
            setInputError(false);
            await saveActivity(user.id, {
                name: selectedActivity,
                description: sanitizedDescription,
                calories: calculateCalories(
                    selectedActivity,
                    distanceNumber,
                    durationNumber,
                    weightNumber,
                ),
                date: today,
            });
            clearFields();
            getDailyCalories();
            navigation.navigate("Home");
        } else {
            setInputError(true);
        }
    };

    useEffect(() => {
        const isValid =
            !isNaN(parseFloat(distanceValue)) &&
            !isNaN(parseFloat(durationValue)) &&
            selectedActivity !== "" &&
            descriptionValue.trim() !== "";
        setInputError(!isValid);
    }, [distanceValue, durationValue, selectedActivity, descriptionValue]);

    return (
        <PaperProvider theme={theme}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                style={{ flex: 1, margin: 20 }}
            >
                <Text>{getDate()}</Text>
                <TitleMajor text="Log New" />

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: 10,
                    }}
                >
                    <TitleMiddle text="Activity" />
                    <Button
                        style={{ alignSelf: "flex-end" }}
                        icon="close"
                        mode="contained"
                        rippleColor="red"
                        onPress={clearFields}
                    >
                        Clear all
                    </Button>
                </View>

                <View style={{ marginTop: 20 }}>
                    {inputError && selectedActivity === "" && (
                        <Text style={{ color: "red", marginLeft: 10 }}>
                            Please select an activity
                        </Text>
                    )}
                    {activities.map((activity) => (
                        <TouchableOpacity
                            key={activity.name}
                            onPress={() => setSelectedActivity(activity.name)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                margin: 10,
                                backgroundColor:
                                    selectedActivity === activity.name
                                        ? "#1A5A41"
                                        : "#EAE7E7",
                                borderRadius: 50,
                                padding: 10,
                            }}
                        >
                            <MaterialCommunityIcons
                                name={activity.icon}
                                size={36}
                                color={
                                    selectedActivity === activity.name
                                        ? "#fff"
                                        : "#000"
                                }
                            />
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color:
                                        selectedActivity === activity.name
                                            ? "#fff"
                                            : "#000",
                                }}
                            >
                                {activity.name}
                            </Text>
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
                    {inputError && distanceValue === "" && (
                        <Text style={{ color: "red" }}>Enter a distance</Text>
                    )}
                    <TextInput
                        style={{ marginBottom: 20 }}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Distance (km)"
                        value={distanceValue}
                        placeholder="e.g. 10.5"
                        onChangeText={setDistanceValue}
                        error={inputError}
                    />
                    {inputError && durationValue === "" && (
                        <Text style={{ color: "red" }}>Enter a duration</Text>
                    )}
                    <TextInput
                        style={{ marginBottom: 20 }}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Duration (min)"
                        value={durationValue}
                        placeholder="e.g. 45"
                        onChangeText={setDurationValue}
                        error={inputError}
                    />
                    {inputError && descriptionValue === "" && (
                        <Text style={{ color: "red" }}>Enter a description</Text>
                    )}
                    <TextInput
                        style={{ marginBottom: 20 }}
                        mode="outlined"
                        keyboardType="default"
                        label="Description"
                        value={descriptionValue}
                        placeholder="e.g. Morning run with John"
                        onChangeText={(text) =>
                            setDescriptionValue(sanitizeInput(text))
                        }
                        error={inputError}
                    />

                    <TouchableOpacity
                        onPress={handleSaveActivity}
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
