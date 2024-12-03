import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Activity = {
  id: number;
  name: string;
  calories: number;
};

const CalorieOverview: React.FC = ({ navigation }: any) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const basalMetabolicRate = 2000; // Example BMR value
  const totalCalories = activities.reduce(
    (sum, activity) => sum - activity.calories,
    -basalMetabolicRate
  );

  const handleDelete = (id: number) => {
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
            setActivities(activities.filter((activity) => activity.id !== id)),
          style: "destructive",
        },
      ]
    );
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>
        {item.name}: -{item.calories} Calories
      </Text>
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditActivity", { activity: item })
          }
        >
          <Ionicons name="create-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivity}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateSportUnit')}
      >
        <Text style={styles.addButtonText}>ADD NEW ACTIVITY</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B5E20",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  calorieCircle: {
    alignSelf: "center",
    backgroundColor: "#fff",
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
    color: "#fff",
  },
  calorieSubText: {
    fontSize: 16,
    color: "#fff",
  },
  noActivityText: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  activityItem: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
  },
});

export default CalorieOverview;
