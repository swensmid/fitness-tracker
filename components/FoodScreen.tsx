import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const foods = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Banana" },
  { id: "3", name: "Carrot" },
  { id: "4", name: "Pizza" },
  { id: "5", name: "Salad" },
];

const FoodSelectionScreen = () => {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  const toggleFood = (id: string) => {
    setSelectedFoods((current) =>
      current.includes(id)
        ? current.filter((foodId) => foodId !== id)
        : [...current, id]
    );
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => {
    const selected = selectedFoods.includes(item.id);
    return (
      <Pressable
        onPress={() => toggleFood(item.id)}
        style={[styles.item, selected && styles.selectedItem]}
      >
        <Text style={styles.itemText}>
          {selected ? "✅ " : "⬜️ "} {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Foods</Text>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={selectedFoods}
      />

      <View style={styles.selectedContainer}>
        <Text style={styles.selectedTitle}>Selected Foods:</Text>
        {selectedFoods.length === 0 ? (
          <Text style={styles.noneText}>None</Text>
        ) : (
          selectedFoods.map((id) => {
            const food = foods.find((f) => f.id === id);
            return (
              <Text key={id} style={styles.selectedItemText}>
                • {food?.name}
              </Text>
            );
          })
        )}
      </View>
    </View>
  );
};

export default FoodSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  item: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "#cce5ff",
    borderColor: "#3399ff",
  },
  itemText: { fontSize: 18 },
  selectedContainer: { marginTop: 24 },
  selectedTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  noneText: { fontStyle: "italic", color: "#999" },
  selectedItemText: { fontSize: 16, marginLeft: 8, marginBottom: 4 },
});
