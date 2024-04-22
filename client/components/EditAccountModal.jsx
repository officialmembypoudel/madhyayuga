import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Text, useTheme } from "@rneui/themed";
import ScreenHeaderComponent from "./ScreenHeaderComponent";
import { containerStyles, phoneRegExp } from "../helpers/objects";
import { AuthContext } from "../context/authContext";
import { Controller, useForm } from "react-hook-form";
import { defaultFont } from "../fontConfig/defaultFont";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { client } from "../configs/axios";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required!")
    .email("Please enter a valid email address!"),
  oldPassword: yup.string().notRequired("Old Password is required!"),
  newPassword: yup.string().notRequired(),
  name: yup.string().required("Name is required!"),
  phone: yup
    .string()
    .required("Phone number is required!")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(9, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
  cPassword: yup
    .string()
    .notRequired()
    .oneOf(
      [yup.ref("newPassword"), null],
      "Passwords must match with new password"
    ),
});

const EditAccountModal = ({ open, setOpen }) => {
  const { theme } = useTheme();
  const { user, setUser, getUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    resetField,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...user,
      oldPassword: "",
      newPassword: "",
      cPassword: "",
      phone: user?.phone?.toString(),
    },
  });

  const handleUpdateUser = async (data) => {
    try {
      setLoading(true);
      const response = await client.put(`/update/me`, data);
      if (response.data.success) {
        setOpen(false);
        setLoading(false);
        setError(null);
        getUser();
        resetField("oldPassword");
        resetField("newPassword");
        resetField("cPassword");
        resetField("phone", {
          defaultValue: data.phone,
        });
        resetField("name", {
          defaultValue: data.name,
        });
      }
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data);
      setError(error?.response?.data);
      console.log(error.message);
    }
  };

  return (
    <Modal visible={open}>
      <View
        style={{
          ...containerStyles,
          backgroundColor: theme.colors.background,
        }}
      >
        <ScreenHeaderComponent
          title={"Edit Account"}
          //   hideModeToggle={false}
          backAction={() => {
            setOpen(false);
            setError(null);
            resetField("oldPassword");
            resetField("newPassword");
            resetField("cPassword");
            resetField("phone", {
              defaultValue: user?.phone?.toString(),
            });
            resetField("name", {
              defaultValue: user?.name,
            });
          }}
        />
        <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingVertical: 0, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 70 }}
          >
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                Your email can't be changed!
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    disabled
                    value={value}
                    onChangeText={async (value) => {
                      onChange(value);
                      await trigger("email");
                    }}
                    inputContainerStyle={{
                      borderWidth: 2,
                      borderRadius: 5,
                      borderBottomWidth: 2,
                      paddingHorizontal: 5,
                      borderColor: theme.colors.grey4,
                      backgroundColor: theme.colors.grey4,
                    }}
                    placeholder="email, eg.: john-doe@gmail.com"
                    keyboardType="email-address"
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                    inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                    autoCapitalize="none"
                    errorMessage={errors.email?.message}
                    errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  />
                )}
                name="email"
              />
            </View>
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                What should we call you?
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={async (value) => {
                      onChange(value);
                      await trigger("name");
                    }}
                    inputContainerStyle={{
                      borderWidth: 2,
                      borderRadius: 5,
                      borderBottomWidth: 2,
                      paddingHorizontal: 5,
                      borderColor: theme.colors.grey4,
                      backgroundColor: theme.colors.grey4,
                    }}
                    placeholder="name, e.g.: John Doe"
                    keyboardType="email-address"
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                    inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                    autoCapitalize="none"
                    errorMessage={errors.name?.message}
                    errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  />
                )}
                name="name"
              />
            </View>
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                Have you changed your number?
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={async (value) => {
                      onChange(value);
                      await trigger("phone");
                    }}
                    inputContainerStyle={{
                      borderWidth: 2,
                      borderRadius: 5,
                      borderBottomWidth: 2,
                      paddingHorizontal: 5,
                      borderColor: theme.colors.grey4,
                      backgroundColor: theme.colors.grey4,
                    }}
                    placeholder="phone, e.g.: 9800000000"
                    keyboardType="email-address"
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                    inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                    autoCapitalize="none"
                    errorMessage={errors.phone?.message}
                    errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  />
                )}
                name="phone"
              />
            </View>
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                If you wish to change your password, please enter your old
                password!
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={async (value) => {
                      onChange(value);
                      await trigger("oldPassword");
                    }}
                    inputContainerStyle={{
                      borderWidth: 2,
                      borderRadius: 5,
                      borderBottomWidth: 2,
                      paddingHorizontal: 5,
                      borderColor: theme.colors.grey4,
                      backgroundColor: theme.colors.grey4,
                    }}
                    placeholder="your old password"
                    keyboardType="email-address"
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                    inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                    autoCapitalize="none"
                    errorMessage={errors.oldPassword?.message}
                    errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  />
                )}
                name="oldPassword"
              />
            </View>
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                If you wish to change your password, please enter your new
                password!
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={async (value) => {
                      onChange(value);
                      await trigger("newPassword");
                    }}
                    inputContainerStyle={{
                      borderWidth: 2,
                      borderRadius: 5,
                      borderBottomWidth: 2,
                      paddingHorizontal: 5,
                      borderColor: theme.colors.grey4,
                      backgroundColor: theme.colors.grey4,
                    }}
                    placeholder="your new password"
                    keyboardType="email-address"
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                    inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                    autoCapitalize="none"
                    errorMessage={errors.newPassword?.message}
                    errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  />
                )}
                name="newPassword"
              />
            </View>
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontFamily: `${defaultFont}_500Medium`,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                If you wish to change your password, please enter your new
                password!
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={async (value) => {
                      onChange(value);
                      await trigger("cPassword");
                    }}
                    inputContainerStyle={{
                      borderWidth: 2,
                      borderRadius: 5,
                      borderBottomWidth: 2,
                      paddingHorizontal: 5,
                      borderColor: theme.colors.grey4,
                      backgroundColor: theme.colors.grey4,
                    }}
                    placeholder="your new password"
                    keyboardType="email-address"
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
                    inputStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                    autoCapitalize="none"
                    errorMessage={errors.cPassword?.message}
                    errorStyle={{ fontFamily: `${defaultFont}_400Regular` }}
                  />
                )}
                name="cPassword"
              />
            </View>

            {error ? (
              <Text
                style={{
                  color: theme.colors.error,
                  fontFamily: `${defaultFont}_400Regular`,
                  marginBottom: 10,
                }}
              >
                {error?.message}
              </Text>
            ) : null}
            <Button
              loading={loading}
              title={"Submit"}
              color={"success"}
              buttonStyle={{ paddingVertical: 10 }}
              onPress={handleSubmit((data) => {
                handleUpdateUser(data);
              })}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default EditAccountModal;

const styles = StyleSheet.create({});
