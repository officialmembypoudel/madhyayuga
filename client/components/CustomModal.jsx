import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text, useTheme } from "@rneui/themed";
import { containerStyles } from "../helpers/objects";
import { useDispatch, useSelector } from "react-redux";
import { defaultFont } from "../fontConfig/defaultFont";
import { NormalDataTextComponent } from "../screens/ItemDisplayScreen";

const CustomModal = ({
  children,
  visible,
  setVisible,
  handleModal,
  handleDone,
  isDoneVisible,
}) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          style={{
            ...containerStyles,
            paddingTop: 0,
            marginTop: 100,
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {isDoneVisible ? (
              <Button
                type="clear"
                title="Done"
                titleStyle={{
                  fontSize: 15,
                  fontFamily: `${defaultFont}_500Medium`,
                }}
                onPress={handleModal}
              />
            ) : null}

            <Button
              type="clear"
              title="Close"
              œ
              titleStyle={{
                fontSize: 15,
                fontFamily: `${defaultFont}_500Medium`,
              }}
              onPress={() => {
                handleModal();
              }}
              containerStyle={{ marginLeft: "auto" }}
            />
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
