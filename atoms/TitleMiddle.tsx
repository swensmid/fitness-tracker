import React = require("react");
import { Text, StyleSheet } from "react-native";

export const TitleMiddle = ({ text }: { text: string }) => {
    return <Text style={styles.TitleMiddle}>{text}</Text>;
};
const styles = StyleSheet.create({
    TitleMiddle: {
        marginVertical: -5,
        color: "#444444",
        fontSize: 25,
        fontFamily: "Montserrat",
    },
});
