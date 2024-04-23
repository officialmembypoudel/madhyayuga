import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, useTheme, useThemeMode } from "@rneui/themed";
import HomeComponent from "../components/HomeComponent";
import AddItemScreen from "../screens/AddItemScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewListings from "../screens/NewListings";
import MyListings from "../screens/MyListings";
import EditListingScreen from "../screens/EditListingScreen";
import MessagesScreen from "../screens/MessagesScreen";
import AccountDetailsScreen from "../screens/AccountDetailsScreen";
import Favourites from "../screens/Favourites";
import ToReview from "../screens/ToReview";
import PurchaseCredit from "../screens/PurchaseCredits";
import AddCreditToListingScreen from "../screens/AddCreditToListing";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import ListingsByCategoryScreen from "../screens/ListingsByCategoryScreen";
import ReportScreen from "../screens/ReportScreen";
import VerifyOTP from "../screens/VerifyOTP";
import AddProfilePhoto from "../screens/AddProfilePhoto";
const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const style = useTheme();
  const { mode } = useThemeMode();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: style.theme.colors.success,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor:
            mode === "light"
              ? "rgba(246, 241, 232,0.8)"
              : style.theme.colors.grey5,
          height: 70,
          position: "absolute",
          elevation: 0,
          paddingTop: 5,
          // paddingBottom: 20,
          borderTopWidth: 0,
          // margin: 10,
          // borderRadius: 30
          // display: route.name === 'Add' ? 'none' : 'flex'
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeComponent}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                type="ionicon"
                name={focused ? "home" : "home-outline"}
                size={25}
                color={style.theme.colors.black}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <Icon
                type="ionicon"
                name={focused ? "grid" : "grid-outline"}
                size={25}
                color={style.theme.colors.black}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddItemScreen}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                type="ionicon"
                style={{
                  backgroundColor: "rgba(170, 170, 170,0.6)",
                  borderRadius: 4,
                  padding: 5,
                }}
                name="add"
                size={25}
                color={style.theme.colors.black}
              />
            );
          },
          tabBarStyle: {
            display: "none",
          },
        })}
      />
      <Tab.Screen
        name="Chat"
        component={ChatsScreen}
        options={{
          // tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: style.theme.colors.warning,
            color: style.theme.colors.background,
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                type="ionicon"
                name={
                  focused
                    ? "chatbubble-ellipses"
                    : "chatbubble-ellipses-outline"
                }
                size={25}
                color={style.theme.colors.black}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={({ route }) => ({
          tabBarStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                type="ionicon"
                name={focused ? "person-circle" : "person-circle-outline"}
                size={30}
                color={style.theme.colors.black}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="NewListing"
        component={NewListings}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Icon
                type="ionicon"
                name={focused ? "person-circle" : "person-circle-outline"}
                size={0}
                color={style.theme.colors.black}
              />
            );
          },
          //   tabBarIconStyle: { display: "none" },
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="myListings"
        component={MyListings}
        options={{
          // tabBarIcon: ({ focused }) => {
          //   return (
          //     <Icon
          //       type="ionicon"
          //       name={focused ? "person-circle" : "person-circle-outline"}
          //       size={0}
          //       color={style.theme.colors.black}
          //     />
          //   );
          // },
          //   tabBarIconStyle: { display: "none" },
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="EditListing"
        component={EditListingScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ReportListing"
        component={ReportScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ToReview"
        component={ToReview}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="PurchaseCredit"
        component={PurchaseCredit}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AddCredit"
        component={AddCreditToListingScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ListingByCategory"
        component={ListingsByCategoryScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AddProfilePhoto"
        component={AddProfilePhoto}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
