import React from "react";
import { Image, useWindowDimensions } from "react-native";

const ASPECT_RATIO = 750 / 350;

export function VehicleHero() {
  const { width } = useWindowDimensions();
  const imgWidth = width * 0.93;
  const imgHeight = imgWidth / ASPECT_RATIO;

  return (
    <Image
      source={require("../assets/images/ranger.png")}
      style={{
        width: imgWidth,
        height: imgHeight,
        alignSelf: "center",
        marginLeft: 12,
      }}
      resizeMode="contain"
    />
  );
}
