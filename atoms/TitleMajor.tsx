import React = require("react");
import { Text, StyleSheet } from "react-native";

export const TitleMajor = ({ text }: { text: string }) => {
    return <Text style={styles.TitleMajor}>{text}</Text>;
};
const styles = StyleSheet.create({
    TitleMajor: {
        marginVertical: -2.5,
        color: "#000000",
        fontSize: 45,
        fontFamily: "Montserrat",
    },
});
