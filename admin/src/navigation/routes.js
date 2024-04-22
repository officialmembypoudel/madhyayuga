"use client";

import { LocationOn } from "@mui/icons-material";
import Category from "@mui/icons-material/Category";
import CircleNotifications from "@mui/icons-material/CircleNotifications";
import Dashboard from "@mui/icons-material/Dashboard";
import ListAlt from "@mui/icons-material/ListAlt";
import Report from "@mui/icons-material/Report";
import SupervisedUserCircle from "@mui/icons-material/SupervisedUserCircle";

const routes = [
  {
    path: "/",
    icon: Dashboard,
    name: "Dashboard",
  },
  {
    path: "/listings",
    icon: ListAlt,
    name: "Listings",
  },
  {
    path: "/category",
    icon: Category,
    name: "Category",
  },
  {
    path: "/locations",
    icon: LocationOn,
    name: "Locations",
  },
  {
    path: "/users",
    icon: SupervisedUserCircle,
    name: "Users",
  },
  {
    path: "/reports",
    icon: Report,
    name: "Reports",
  },
  {
    path: "/notification",
    icon: CircleNotifications,
    name: "Notification",
  },
];

export default routes;
