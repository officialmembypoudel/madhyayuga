import { StyleSheet, View, Image } from "react-native";
import React, { useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  Text,
  Button,
  useThemeMode,
  useTheme,
  Icon,
  Input,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { client } from "../configs/axios";

const ConfirmEmail = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const forgotPassword = async () => {
    try {
      setLoading(true);
      const response = await client.post("/forgot-password", {
        email: email,
      });
      response.data && setLoading(false);
      response.data && navigation.navigate("ResetPassword", { email: email });

      response.data && setError({});
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data);
      setError(error?.response?.data);
    }
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="Confirm Email" hideModeToggle={true} />

      <View style={{ width: "100%" }}>
        <Text
          style={{
            fontFamily: `${defaultFont}_500Medium`,
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          Please enter your email so we can identify you!
        </Text>
        <Input
          value={email}
          onChangeText={(value) => {
            setEmail(value);
          }}
          inputContainerStyle={{
            borderWidth: 2,
            borderRadius: 5,
            borderBottomWidth: 2,
            paddingHorizontal: 5,
            borderColor: theme.colors.grey4,
            backgroundColor: theme.colors.grey4,
          }}
          leftIcon={<Icon name="mail" type="feather" />}
          placeholder="email"
          keyboardType="email-address"
          containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
          inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
          autoCapitalize="none"
          errorMessage={error?.message}
          errorStyle={{
            fontFamily: `${defaultFont}_400Regular`,
            fontSize: 12,
            color: theme.colors.error,
          }}
        />
      </View>
      <View style={{ width: "100%", marginTop: "auto", marginBottom: 70 }}>
        <Button
          color={"success"}
          buttonStyle={{ padding: 10 }}
          title={"Forgot Password"}
          onPress={forgotPassword}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default ConfirmEmail;

const styles = StyleSheet.create({});
