import React, { useEffect, useState } from "react";
import { Divider, Icon, Overlay, Text, useTheme } from "@rneui/themed";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { defaultFont } from "../fontConfig/defaultFont";
import { containerStyles } from "../helpers/objects";
import ScreenHeaderComponent from "./ScreenHeaderComponent";
import CategoryCard from "./CategoryCard";
import { useSelector } from "react-redux";
import { getAllCategories } from "../store/listings";

function Picker({ items, onChange, value }) {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState(value);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (category) => {
    setSelectedValue(category);
    onChange(category);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          backgroundColor: theme.colors.grey4,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        activeOpacity={0.9}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: `${defaultFont}_400Regular`,
            padding: 11,
            paddingHorizontal: 7,
            color: !value ? theme.colors.grey3 : theme.colors.black,
          }}
        >
          {value ? value?.name : "Category"}
        </Text>
        <Icon name="chevron-down" type="evilicon" />
      </TouchableOpacity>
      <Modal
        visible={visible}
        animationType="slide"
        statusBarTranslucent
        fullScreen
      >
        <View
          style={{
            ...containerStyles,
            backgroundColor: theme.colors.background,
          }}
        >
          <ScreenHeaderComponent
            title="Select Category"
            backAction={() => {
              setSelectedValue(null);
              setVisible(false);
            }}
          />
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
            {items.map((category, index) => (
              <TouchableOpacity
                key={category._id}
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  marginBottom: 10,
                  borderRadius: 10,
                  elevation: 3,
                  marginRight: index % 3 === 2 ? 0 : "7.33%",
                }}
                onPress={() => handleSelect(category)}
              >
                <CategoryCard category={category} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

export function BidPicker({ items, onChange, value }) {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState(value);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          backgroundColor: theme.colors.grey4,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        activeOpacity={0.9}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: `${defaultFont}_400Regular`,
            padding: 11,
            paddingHorizontal: 7,
            color: !value ? theme.colors.grey3 : theme.colors.black,
          }}
        >
          {value ? value?.name : "Category"}
        </Text>
        <Icon name="chevron-down" type="evilicon" />
      </TouchableOpacity>
      <Modal
        visible={visible}
        animationType="slide"
        statusBarTranslucent
        fullScreen
      >
        <View
          style={{
            ...containerStyles,
            backgroundColor: theme.colors.background,
          }}
        >
          <ScreenHeaderComponent
            title="Select Your Bid"
            backAction={() => {
              setSelectedValue(null);
              setVisible(false);
            }}
          />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              marginHorizontal: "1%",
              alignItems: "center",
              // gap: "9%",
            }}
          ></View>
        </View>
      </Modal>
    </>
  );
}

export default Picker;

export const LocationPicker = ({ items, onChange, value }) => {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState(value);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (location) => {
    setSelectedValue(location.city);
    onChange(location.city);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          backgroundColor: theme.colors.grey4,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        activeOpacity={0.9}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: `${defaultFont}_400Regular`,
            padding: 11,
            paddingHorizontal: 7,
            color: !value ? theme.colors.grey3 : theme.colors.black,
          }}
        >
          {value ? value : "location"}
        </Text>
        <Icon name="chevron-down" type="evilicon" />
      </TouchableOpacity>
      <View>
        <Modal visible={visible} animationType="slide" fullScreen>
          <View
            style={{
              ...containerStyles,
              backgroundColor: theme.colors.background,
            }}
          >
            <ScreenHeaderComponent
              title="Select Location"
              backAction={() => {
                setVisible(false);
              }}
            />
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
              <ScrollView style={{ width: "100%" }}>
                {items.map((location, index) => (
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
                        padding: 10,
                      }}
                      onPress={() => handleSelect(location)}
                    >
                      <Text
                        style={{
                          fontFamily: `${defaultFont}_400Regular`,
                          fontSize: 18,
                          color: theme.colors.black,
                        }}
                      >
                        {location.city}
                      </Text>
                    </TouchableOpacity>
                    <Divider />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};
