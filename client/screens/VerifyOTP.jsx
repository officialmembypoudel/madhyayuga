import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useState } from "react";
import { containerStyles } from "../helpers/objects";
import {
  Text,
  Button,
  useThemeMode,
  useTheme,
  Icon,
  Input,
  Card,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import ScreenHeaderComponent from "../components/ScreenHeaderComponent";
import noInternetImg from "../assets/please-login.png";
import { defaultFont } from "../fontConfig/defaultFont";
import { AuthContext } from "../context/authContext";
import { client } from "../configs/axios";

const VerifyOTP = () => {
  const style = useTheme();
  const navigation = useNavigation();
  const { user, setIsSignedIn, setUser } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resendOTP = async () => {
    try {
      const response = await client.get("/verify");
      console.log(response.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const VerifyOTP = async () => {
    setLoading(true);
    try {
      if (otp) {
        const response = await client.post(
          "/verify",
          {
            otp: otp,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.user) {
          setUser(response.data.user);
          navigation.navigate("AddProfilePhoto", { header: false });
          setLoading(false);
          setError(null);
        }
      } else {
        console.log("no otp");
        setLoading(false);
      }
    } catch (error) {
      console.log(error?.response?.data);
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        ...containerStyles,
        backgroundColor: style.theme.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {}}
          style={{
            flexDirection: "row",
            alignItems: "center",
            // marginBottom: 20,
          }}
        >
          <Text
            h4
            h4Style={{
              fontFamily: `${defaultFont}_600SemiBold`,
              fontWeight: "600",
            }}
          >
            Verify your account
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", justifyContent: "space-between", flex: 1 }}>
        <View>
          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
              fontSize: 15,
              marginBottom: 5,
            }}
          >{`Please enter the otp sent to ${user.email} `}</Text>
          <Input
            value={otp}
            onChangeText={(value) => setOTP(value)}
            inputContainerStyle={{
              borderWidth: 2,
              borderRadius: 5,
              borderBottomWidth: 2,
              paddingHorizontal: 5,
              borderColor: style.theme.colors.grey4,
              backgroundColor: style.theme.colors.grey4,
            }}
            leftIcon={<Icon name="dots-three-horizontal" type="entypo" />}
            // errorMessage="Fuck@nigga.com"
            placeholder="otp"
            keyboardType="phone-pad"
            containerStyle={{ paddingHorizontal: 0, marginBottom: 0 }}
            inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
            errorMessage={error}
          />
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={resendOTP}
          >
            <Text
              style={{
                fontFamily: `${defaultFont}_400Regular`,
                fontSize: 15,
                marginBottom: 5,
                textAlign: "center",
                color: style.theme.colors.primary,
              }}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
        <Card
          containerStyle={{
            flexDirection: "row",
            borderWidth: 0,
            backgroundColor: "rgba(0,0,128, 0.1)",
            elevation: 0,
            borderRadius: 5,
          }}
          wrapperStyle={{
            // backgroundColor: "red",
            flexDirection: "row",
            gap: 15,
          }}
        >
          <Icon
            name="warning"
            type="entypo"
            color={style.theme.colors.primary}
          />

          <Text
            style={{
              fontFamily: `${defaultFont}_400Regular`,
              fontSize: 15,
              // marginBottom: 5,
              textAlign: "justify",
              color: style.theme.colors.primary,
              width: "87%",
              // backgroundColor: "blue",
            }}
          >
            With a verified account you can post your listings, chat and comment
            with other users and use more features.
          </Text>
        </Card>
        <Button
          disabled={!otp}
          loading={loading}
          title="Verify"
          titleStyle={{
            fontFamily: `${defaultFont}_500Medium`,
          }}
          containerStyle={{
            borderRadius: 5,
            marginVertical: 30,
          }}
          buttonStyle={{ paddingVertical: 13 }}
          onPress={VerifyOTP}
          color="success"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({});
