import { Text, StyleSheet } from "react-native";
import React from "react";

export const TitleMinor = ({ text }: { text: string }) => {
  return <Text style={styles.TitleMinor}>{text}</Text>;
};
const styles = StyleSheet.create({
  TitleMinor: {
    marginVertical: -5,
    color: "#999999",
    fontSize: 10,
    fontFamily: "Montserrat",
  },
});
