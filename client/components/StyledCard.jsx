import { Card, useTheme, useThemeMode } from "@rneui/themed";

const StyledCard = ({ children, paddingEnabled = true, selected = false }) => {
  const style = useTheme();
  const { mode } = useThemeMode();
  return (
    <Card
      containerStyle={{
        // width: "100%",
        margin: 0,
        marginBottom: 10,
        padding: paddingEnabled ? 10 : false,
        backgroundColor: selected
          ? style.theme.colors.grey3
          : mode === "dark"
          ? style.theme.colors.grey4
          : style.theme.colors.background,
        borderWidth: 0,
        borderRadius: 10,
        //   width: 105,
        elevation: 1,
      }}
    >
      {children}
    </Card>
  );
};

export default StyledCard;
