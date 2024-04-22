import { View } from "react-native";
import React from "react";
import { Icon, Text } from "@rneui/themed";
import { defaultFont } from "../fontConfig/defaultFont";

const UserRating = ({ rating, total }) => {
  const stars = Array.from({ length: 5 }); // Create an array of length 5 for all stars

  return (
    <View style={{ flexDirection: "row", marginLeft: 2 }}>
      {rating > 0 &&
        total > 0 &&
        stars.map((_, index) => (
          <Icon
            key={index}
            name="star"
            size={15}
            color={index < rating / total ? "gold" : "gray"}
          />
        ))}
      {!rating && !total && (
        <Text style={{ fontFamily: `${defaultFont}_400Regular` }}>
          No Ratings Yet
        </Text>
      )}
    </View>
  );
};

export default UserRating;
