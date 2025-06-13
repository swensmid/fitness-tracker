import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
} from "react-native";
import { useUser } from "./UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProfileScreen = () => {
    const { user, saveUser, calorieBaseRate } = useUser();

    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("M");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setGender(user.gender || "M");
            setWeight(user.weight?.toString() || "");
            setHeight(user.height?.toString() || "");
            setBirthdate(user.birthdate || "");
        }
    }, [user]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const isoDate = selectedDate.toISOString().split("T")[0];
            setBirthdate(isoDate);
        }
    };

    const handleConfirm = () => {
        if (!username || !birthdate || !weight || !height) {
            Alert.alert("Missing Data", "Please fill out all fields.");
            return;
        }

        saveUser({
            username,
            birthdate,
            height: parseFloat(height),
            gender: gender.toUpperCase() === "F" ? "F" : "M",
            weight: parseFloat(weight),
        }).then(() => {
            Alert.alert("Success", "Profile saved!");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
            />

            <Text style={styles.label}>Gender</Text>
            <TextInput
                style={styles.input}
                value={gender}
                onChangeText={(text) => setGender(text.toUpperCase())}
                placeholder="M/F"
                maxLength={1}
            />

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter your weight"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Enter your height"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Birthday</Text>
            <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={{ color: birthdate ? "#000" : "#888" }}>
                    {birthdate || "Select your birthday"}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={birthdate ? new Date(birthdate) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.label}>Calorie Base Rate</Text>
            <Text style={styles.calorie}>{calorieBaseRate} Cals</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#000",
    },
    label: {
        fontSize: 18,
        marginTop: 10,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    dateInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    calorie: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: "bold",
        color: "#333",
    },
    confirmButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
