import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { UserProvider, useUser } from "./UserContext";
import * as SQLite from "expo-sqlite";

const ProfileScreen = () => {
    const { user, saveUser } = useUser();

    const [username, setUsername] = useState(user?.username || "");
    const [gender, setGender] = useState(user?.gender || "M");
    const [weight, setWeight] = useState(user?.weight?.toString() || "");
    const [height, setHeight] = useState(user?.height?.toString() || "");
    const [birthdate, setBirthdate] = useState(user?.birthdate || "");
    //TODO: richtige werte einsetzen
    const calculateCalorieBaseRate = () => {
        const parsedWeight = parseFloat(weight || "0");
        const parsedHeight = parseFloat(height || "0");
        const age = birthdate
            ? new Date().getFullYear() - new Date(birthdate).getFullYear()
            : 0;

        if (!parsedWeight || !parsedHeight || !age) return "0 Cals";

        if (gender === "M") {
            return (
                Math.round(
                    10 * parsedWeight + 6.25 * parsedHeight - 5 * age + 5,
                ) + " Cals"
            );
        } else {
            return (
                Math.round(
                    10 * parsedWeight + 6.25 * parsedHeight - 5 * age - 161,
                ) + " Cals"
            );
        }
    };

    const handleConfirm = () => {
        if (!username || !height || !birthdate || !weight) {
            alert("Please fill out all fields.");
            return;
        }

        saveUser({
            username: username,
            birthdate: birthdate,
            height: parseFloat(height),
            gender,
            weight: parseFloat(weight),
        });
    };

    const handleShowUserData = async () => {
        const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
        if (db) {
            await db.withTransactionAsync(async () => {
                const result = await db.getFirstAsync(`SELECT
                                                                        ID AS id,
                                                                        Username AS username,
                                                                        Birthdate AS birthdate,
                                                                        Height_cm AS height,
                                                                        Gender AS gender
                                                                     FROM User WHERE ID = 1`);
                console.log(result);
            });
        } else {
            console.log("womp");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
            />

            {/* Gender */}
            <Text style={styles.label}>Gender</Text>
            <TextInput
                style={styles.input}
                value={gender}
                onChangeText={(text) => setGender(text.toUpperCase())}
                placeholder="M/F"
                maxLength={1}
            />

            {/* Weight */}
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter your weight"
                keyboardType="numeric"
            />

            {/* Height */}
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Enter your height"
                keyboardType="numeric"
            />

            {/* Birthday */}
            <Text style={styles.label}>Birthday</Text>
            <TextInput
                style={styles.input}
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder="YYYY-MM-DD"
            />

            {/* Calorie Base Rate */}
            <Text style={styles.label}>Calorie Base Rate</Text>
            <Text style={styles.calorie}>{calculateCalorieBaseRate()}</Text>

            {/* Confirm Button */}
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
            >
                <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleShowUserData}
            >
                <Text style={styles.confirmText}>Show User</Text>
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
