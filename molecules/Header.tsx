import React from "react";
import { View } from "react-native";
import { TitleMajor } from "../atoms/TitleMajor";
import { TitleMiddle } from "../atoms/TitleMiddle";
import { TitleMinor } from "../atoms/TitleMinor";

const Header = ({minor, middle, major}: {minor: any, middle: any, major: any}) => {
  return (
    <View style={{ alignItems: "flex-start" }}>
      <TitleMinor text={minor} />
      <TitleMajor text={major} />
      <TitleMiddle text={middle} />
    </View>
  );
};

export default Header;
