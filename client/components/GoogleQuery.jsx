import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { containerStyles } from "../helpers/objects";
import { useTheme } from "@rneui/themed";
import { defaultFont } from "../fontConfig/defaultFont";
import WebView from "react-native-webview";

const GoogleQuery = ({ visible, setVisible, query }) => {
  const { theme } = useTheme();
  return (
    <Modal statusBarTranslucent transparent visible={visible}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)" }}>
        <View
          style={{
            ...containerStyles,
            paddingTop: 10,
            marginTop: 90,
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 0,
          }}
        >
          <TouchableOpacity
            style={{ paddingHorizontal: 10 }}
            onPress={() => setVisible(false)}
          >
            <Text
              style={{
                fontFamily: `${defaultFont}_500Medium`,
                fontSize: 14,
                color: theme.colors.primary,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
          <View
            style={{ width: "100%", height: "100%", backgroundColor: "red" }}
          >
            <WebView
              style={{ width: "100%" }}
              source={{
                uri: `http://www.google.com/images?q=${encodeURIComponent(
                  query
                )}`,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoogleQuery;

const styles = StyleSheet.create({});
