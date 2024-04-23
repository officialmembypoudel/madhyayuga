import { StyleSheet, View, Image } from "react-native";
import React, { useContext, useState } from "react";
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

import { AuthContext } from "../context/authContext";
import { defaultFont } from "../fontConfig/defaultFont";
import { client } from "../configs/axios";

const ResetPasswordScreen = ({ route }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const { email } = route.params;
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, setUser, setIsSignedIn } = useContext(AuthContext);

  const resetPassword = async () => {
    try {
      setLoading(true);
      const response = await client.post("/reset-password", {
        email: email,
        otp: parseInt(OTP),
        password: password,
        confirmPassword: confirmPassword,
      });
      response.data && setLoading(false);
      response.data && setUser(response.data?.user);
      response.data && setIsSignedIn(true);
      response.data && setOTP("");
      response.data && setPassword("");
      response.data && setConfirmPassword("");
      response.data && setError({});
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data);
      setError(error?.response?.data);
      console.log(error.message);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const response = await client.patch("/verify", {
        email: email,
      });
      response.data && setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data);
    }
  };

  return (
    <View
      style={{
        ...containerStyles,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScreenHeaderComponent title="Reset Password" hideModeToggle={true} />

      <View style={{ width: "100%" }}>
        <Text
          style={{
            fontFamily: `${defaultFont}_500Medium`,
            fontSize: 18,
            marginBottom: 15,
          }}
        >
          Please enter otp provided in {email}!
        </Text>
        <Input
          value={OTP}
          onChangeText={(value) => {
            setOTP(value);
          }}
          inputContainerStyle={{
            borderWidth: 2,
            borderRadius: 5,
            borderBottomWidth: 2,
            paddingHorizontal: 5,
            borderColor: theme.colors.grey4,
            backgroundColor: theme.colors.grey4,
          }}
          leftIcon={<Icon name="dots-three-horizontal" type="entypo" />}
          placeholder="OTP"
          containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
          inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
          autoCapitalize="none"
          keyboardType="numeric"
        />
        <Input
          value={password}
          onChangeText={(value) => {
            setPassword(value);
          }}
          inputContainerStyle={{
            borderWidth: 2,
            borderRadius: 5,
            borderBottomWidth: 2,
            paddingHorizontal: 5,
            borderColor: theme.colors.grey4,
            backgroundColor: theme.colors.grey4,
          }}
          leftIcon={<Icon name="lock" type="feather" />}
          placeholder="Password"
          containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
          inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <Input
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
          }}
          inputContainerStyle={{
            borderWidth: 2,
            borderRadius: 5,
            borderBottomWidth: 2,
            paddingHorizontal: 5,
            borderColor: theme.colors.grey4,
            backgroundColor: theme.colors.grey4,
          }}
          leftIcon={<Icon name="lock" type="feather" />}
          placeholder="Confirm Password"
          containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
          inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
          autoCapitalize="none"
          secureTextEntry={true}
          errorMessage={error?.message}
          errorStyle={{
            fontFamily: `${defaultFont}_400Regular`,
            fontSize: 12,
            color: theme.colors.error,
          }}
        />
        <Button
          type="clear"
          buttonStyle={{ alignSelf: "flex-end", padding: 0 }}
          title="Resend OTP"
          onPress={resendOTP}
        />
      </View>

      <View style={{ width: "100%", marginTop: "auto", marginBottom: 70 }}>
        <Button
          color={"success"}
          buttonStyle={{ padding: 10 }}
          title={"Forgot Password"}
          onPress={resetPassword}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({});
