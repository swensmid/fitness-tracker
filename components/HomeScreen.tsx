import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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

type CalorieOverviewProps = {
  navigation: any; // Ideally type with React Navigation types
};

const CalorieOverview: React.FC<CalorieOverviewProps> = ({ navigation }) => {
  const { user, calories, setCalories, getDailyCalories } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCalories, setTotalCalories] = useState<string>("0");

  // Calculate age from birthdate string
  const calculateAge = (birthdate: string) => {
    if (!birthdate) return 0;
    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  };

  // Calculate basal metabolic rate (BMR)
  const basalMetabolicRate = (() => {
    if (!user) return 0;

    const weight = user.weight;
    const height = user.height;
    const gender = user.gender;
    const age = calculateAge(user.birthdate || "");

    if (!weight || !height || !age) return 0;

    return Math.round(
      10 * weight +
        6.25 * height -
        5 * age +
        (gender === "M" ? 5 : -161)
    );
  })();

  // Fetch today's activities and calorie total
  const fetchData = async () => {
    try {
      const [fetchedActivities, fetchedCalories] = await Promise.all([
        getTodaysActivities(),
        getDailyCalories(),
      ]);

      setActivities(Array.isArray(fetchedActivities) ? fetchedActivities : []);

      const validCalories =
        typeof fetchedCalories === "number" && fetchedCalories >= 0;

      const netCalories = validCalories
        ? (fetchedCalories - basalMetabolicRate).toFixed(0)
        : (-basalMetabolicRate).toString();

      if (validCalories) setCalories(fetchedCalories);
      setTotalCalories(netCalories);
    } catch (error) {
      console.error("Error fetching data:", error);
      setActivities([]);
      setTotalCalories((-basalMetabolicRate).toString());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDeleteActivity = (id: number) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteActivity(id);
              const updatedActivities = activities.filter((a) => a.Id !== id);
              setActivities(updatedActivities);

              const updatedCalories = await getDailyCalories();
              setCalories(updatedCalories);

              const net = (
                (updatedCalories ?? 0) - basalMetabolicRate
              ).toFixed(0);
              setTotalCalories(net);
            } catch (error) {
              console.error("Error deleting activity:", error);
            }
          },
        },
      ]
    );
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>
        {item.Name}: +{item.Calories.toFixed(0)} Calories
      </Text>
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditSportUnit", { activity: item })
          }
          style={{ marginRight: 15 }}
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
          <Text style={styles.calorieText}>{totalCalories}</Text>
          <Text style={styles.calorieSubText}>Calories</Text>
        </View>
      </View>
      {activities.length === 0 ? (
        <Text style={styles.noActivityText}>No Recent Activity Found</Text>
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
    flexShrink: 1,
  },
  icons: {
    flexDirection: "row",
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
