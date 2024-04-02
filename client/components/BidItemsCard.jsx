import { View } from "react-native";
import React from "react";
import StyledCard from "./StyledCard";
import { Avatar, Text } from "@rneui/themed";
import { defaultFont } from "../fontConfig/defaultFont";
import { setImageQuality } from "../helpers/functions";

const BidItemsCard = ({ item, selectedBid, hideUserName }) => {
  return (
    <StyledCard selected={selectedBid?._id === item?._id ? true : false}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Avatar
          size="medium"
          rounded
          source={{ uri: setImageQuality(item?.images[0]?.url, 30) }}
        />
        <View>
          {!hideUserName && (
            <Text style={{ fontFamily: `${defaultFont}_600SemiBold` }}>
              {item?.userId?.name}
            </Text>
          )}
          <Text style={{ fontFamily: `${defaultFont}_500Medium` }}>
            {item?.name}
          </Text>
          <Text
            style={{
              fontFamily: `${defaultFont}_300Light`,
              fontSize: 12,
            }}
          >
            {new Date(item?.createdAt).toDateString()}
          </Text>
        </View>
      </View>
    </StyledCard>
  );
};

export default BidItemsCard;
