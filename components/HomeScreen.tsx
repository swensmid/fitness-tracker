import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteActivity, getTodaysActivities } from "./Database/Scripts";

type Activity = {
    UserId: number;
    Id: number;
    Name: string;
    Description: string;
    Calories: number;
    Date: string;
};

/**
 * The CalorieOverview component displays the total calories burned for the day,
 * including the basal metabolic rate. It also displays a list of activities
 * for the day, with options to delete or edit each activity.
 *
 * @param {Object} props - The props object passed from the parent component.
 * @param {Function} props.navigation - The navigation function passed from the parent component.
 * @returns {JSX.Element} The CalorieOverview component.
 */
const CalorieOverview: React.FC = ({ navigation }: any) => {
    const { user, calories, setCalories, getDailyCalories } = useUser();
    const [activities, setActivities] = useState<Activity[]>([]);
    const basalMetabolicRate = user?.weight
        ? Math.round(
              10 * user.weight +
                  6.25 * (user.height || 0) -
                  5 * 30 +
                  (user.gender === "M" ? 5 : -161),
          )
        : 80085;

    const [totalCalories, setTotalCalories] = useState<string | "0" | null>(
        "-" + basalMetabolicRate.toString(),
    );

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activities = await getTodaysActivities();

                if (
                    activities === null ||
                    activities === undefined ||
                    !activities
                ) {
                    setActivities([]);
                }
                setActivities(activities as Activity[]);
            } catch (error) {
                console.error("Error in fetchActivities:", error);
            }
        };

        const fetchCalories = async () => {
            try {
                const dailyCalories = await getDailyCalories(user.id);
                if (
                    dailyCalories === null ||
                    dailyCalories === undefined ||
                    isNaN(dailyCalories) ||
                    dailyCalories < 0
                ) {
                    // TODO: DO NOT CAST TO STRING
                    setTotalCalories("-" + basalMetabolicRate.toString());
                    return {
                        totalCalories: "-" + basalMetabolicRate.toString(),
                    };
                } else {
                    setCalories(dailyCalories);
                    const total = (-calories - basalMetabolicRate).toFixed(0);
                    setTotalCalories(total);
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
            }
        };
        fetchActivities();
        fetchCalories();
    }, [calories, totalCalories, calories, basalMetabolicRate]);

    const handleDeleteActivity = (id: number) => {
        Alert.alert(
            "Delete Activity",
            "Are you sure you want to delete this activity?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () =>
                        deleteActivity(id)
                            .then(getDailyCalories)
                            .then(() =>
                                setActivities(
                                    activities.filter(
                                        (activity) => activity.Id !== id,
                                    ),
                                ),
                            ),
                    style: "destructive",
                },
            ],
        );
    };

    const renderActivity = ({ item }: { item: Activity }) => (
        <View style={styles.activityItem}>
            <Text style={styles.activityText}>
                {item.Name}: -{item.Calories.toFixed(0)} Calories
            </Text>
            <View style={styles.icons}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("EditSportUnit", { activity: item })
                    }
                >
                    <Ionicons name="create-outline" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteActivity(item.Id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Summary</Text>
            <Text style={styles.subtitle}>Activity</Text>
            <View style={styles.calorieCircle}>
                <View style={styles.innerCircle}>
                    <Text style={styles.calorieText}>
                        {totalCalories === null
                            ? basalMetabolicRate
                            : totalCalories}
                    </Text>
                    <Text style={styles.calorieSubText}>Calories</Text>
                </View>
            </View>
            {activities.length === 0 ? (
                <Text style={styles.noActivityText}>
                    No Recent Activity Found
                </Text>
            ) : (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.Id.toString()}
                    renderItem={renderActivity}
                />
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("CreateSportUnit")}
            >
                <Text style={styles.addButtonText}>ADD NEW ACTIVITY</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A5A41",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#EAE7E7",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        color: "#EAE7E7",
        textAlign: "center",
    },
    calorieCircle: {
        alignSelf: "center",
        backgroundColor: "#EAE7E7",
        borderWidth: 10,
        borderColor: "#000",
        width: 240,
        height: 240,
        borderRadius: 120,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    innerCircle: {
        backgroundColor: "#000",
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: "center",
        alignItems: "center",
    },
    calorieText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#EAE7E7",
    },
    calorieSubText: {
        fontSize: 16,
        color: "#EAE7E7",
    },
    noActivityText: {
        color: "#EAE7E7",
        textAlign: "center",
        marginVertical: 10,
    },
    activityItem: {
        backgroundColor: "#EAE7E7",
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    activityText: {
        fontSize: 16,
        color: "#000",
    },
    icons: {
        flexDirection: "row",
        gap: 15,
    },
    addButton: {
        backgroundColor: "#EAE7E7",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1A5A41",
    },
});

export default CalorieOverview;
