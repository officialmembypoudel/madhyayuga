import { Keyboard, View } from "react-native";
import React, { useState } from "react";
import {
  makeStyles,
  Text,
  Button,
  useThemeMode,
  useTheme,
  SearchBar,
  Icon,
} from "@rneui/themed";
import { SearchBarAndroid } from "@rneui/base/dist/SearchBar/SearchBar-android";
import { defaultFont } from "../fontConfig/defaultFont";

const SearchBarComponent = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const [query, setQuery] = useState("");
  // console.log(query);
  return (
    <View>
      <SearchBarAndroid
        value={query}
        containerStyle={{
          backgroundColor: "rgba(0,0,0,0)",
          width: "100%",
          padding: 0,
          height: 67,
          borderColor: "rgba(0,0,0,0)",
          // marginVertical: 5,
        }}
        inputContainerStyle={{
          backgroundColor: "rgba(0,0,0,0)",
          borderRadius: 10,
          borderWidth: 2,
          borderColor: theme.theme.colors.black,
          height: 50,
          width: "100%",
          borderBottomWidth: 2,
        }}
        searchIcon={
          <Icon
            name="search"
            color={mode === "dark" ? theme.theme.colors.grey0 : null}
          />
        }
        cancelIcon={
          <Icon
            name="arrow-back"
            type="ionIcons"
            color={mode === "dark" ? theme.theme.colors.grey0 : null}
            onPress={() => Keyboard.dismiss()}
            // reverseColor
            containerStyle={{ borderRadius: 30 }}
          />
        }
        clearIcon={
          <Icon
            name="cancel"
            color={mode === "dark" ? theme.theme.colors.grey0 : null}
            onPress={() => setQuery("")}
            // reverseColor
            containerStyle={{ borderRadius: 30 }}
          />
        }
        inputStyle={{
          color: theme.theme.colors.grey0,
          fontFamily: `${defaultFont}_500Medium`,
        }}
        onChangeText={(input) => setQuery(input)}
        onClear={() => setQuery("")}
        placeholder="Something on Mind?"
        selectionColor={theme.theme.colors.primary}
      />
    </View>
  );
};

export default SearchBarComponent;
