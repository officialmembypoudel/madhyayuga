import { StyleSheet, View, Image } from "react-native";
import React, { useContext, useState } from "react";
import { containerStyles } from "../helpers/objects";
import { Text, Button, useThemeMode, useTheme, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { defaultFont } from "../fontConfig/defaultFont";
import EditAccountModal from "../components/EditAccountModal";
import { AuthContext } from "../context/authContext";

const Details = ({ title, value, icon, iconType }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Icon name={icon} type={iconType} size={20} />
        <Text style={{ fontFamily: `${defaultFont}_500Medium`, fontSize: 16 }}>
          {title}
        </Text>
      </View>
      <Text style={{ fontFamily: `${defaultFont}_500Medium`, fontSize: 16 }}>
        {value}
      </Text>
    </View>
  );
};

const AccountDetailsScreen = ({ route }) => {
  const style = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { goBack } = route?.params;
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <ScreenHeaderComponent
        title="My Account"
        backAction={() => navigation.navigate(goBack)}
      />
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
          paddingBottom: 80,
        }}
      >
        <View>
          <Details
            title={"Name"}
            value={user?.name}
            icon={"person"}
            iconType={"material"}
          />
          <Details
            title={"Email"}
            value={user?.email}
            icon={"email"}
            iconType={"material"}
          />
          <Details
            title={"Phone"}
            value={user?.phone}
            icon={"phone"}
            iconType={"material"}
          />
        </View>
        <View style={{ width: "100%" }}>
          <Button
            buttonStyle={{
              marginBottom: 20,
              borderRadius: 5,
              padding: 10,
              alignItems: "center",
            }}
            color={"success"}
            title="Edit Account"
            icon={
              <Icon name="edit" color={"#fff"} style={{ marginRight: 20 }} />
            }
            titleStyle={{}}
            iconPosition="left"
            iconContainerStyle={{ marginRight: 20 }}
            onPress={() => setOpen(true)}
          />
          <EditAccountModal open={open} setOpen={setOpen} />
          {/* <Button
            buttonStyle={{
              marginBottom: 20,
              borderRadius: 5,
              padding: 10,
              alignItems: "center",
              borderColor: style.theme.colors.error,
            }}
            type="outline"
            title="Delete Account"
            icon={
              <Icon
                name="delete"
                color={style.theme.colors.error}
                style={{ marginRight: 20 }}
              />
            }
            titleStyle={{ color: style.theme.colors.error }}
            iconPosition="left"
            iconContainerStyle={{ marginRight: 20 }}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default AccountDetailsScreen;

const styles = StyleSheet.create({});
