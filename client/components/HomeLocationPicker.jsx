import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@rneui/themed";
import { useSelector } from "react-redux";
import { getLocations } from "../store/listings";
import { Divider } from "@rneui/base";
import { defaultFont } from "../fontConfig/defaultFont";
import { containerStyles } from "../helpers/objects";

const HomeLocationPicker = ({ visible, setVisible, onChange }) => {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState();
  //   const [visible, setVisible] = useState(false);
  const locations = useSelector(getLocations);

  const handleSelect = (location) => {
    setSelectedValue(location.city);
    onChange(location.city);
    setVisible(false);
  };

  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      animationType="slide"
      fullScreen
      transparent
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)" }}>
        <View
          style={{
            ...containerStyles,
            backgroundColor: theme.colors.background,
            marginTop: 90,
            paddingTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity style={{ padding: 5 }}>
            <Text
              style={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 14,
                color: theme.colors.primary,
              }}
              onPress={() => setVisible(false)}
            >
              Done
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              marginHorizontal: "1%",
              alignItems: "center",
              // gap: "9%",
            }}
          >
            {[{ _id: "xyz", city: "Nepal" }, ...locations]?.map(
              (location, index) => (
                <View
                  key={location._id}
                  style={{ width: "100%", marginBottom: 20 }}
                >
                  <TouchableOpacity
                    key={location._id}
                    style={{
                      backgroundColor: "rgba(0,0,0,0)",
                      marginBottom: 10,
                      borderRadius: 10,
                      elevation: 3,
                      width: "100%",
                    }}
                    onPress={() => handleSelect(location)}
                  >
                    <Text
                      style={{
                        fontFamily: `${defaultFont}_400Regular`,
                        fontSize: 18,
                        padding: 5,
                        color: theme.colors.black,
                        width: "100%",
                      }}
                    >
                      {location.city}
                    </Text>
                  </TouchableOpacity>
                  <Divider />
                </View>
              )
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default HomeLocationPicker;
