"use client";

import routes from "@/navigation/routes";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = () => {
  const pathname = usePathname();
  const { palette } = useTheme();
  return (
    <List>
      {routes.map(({ path, name, icon: Icon }) => (
        <ListItem
          key={path}
          disablePadding
          sx={{
            marginBottom: 1,
            borderRadius: 1,
            "&:hover": {
              bgcolor: palette.secondary.main,
              color: "#fff",
            },
            ...(pathname === path && {
              bgcolor: palette.primary.main,
              color: "#fff",
            }),
            transition: "all 0.3s ease-in-out",
          }}
        >
          <ListItemButton href={path}>
            <Icon sx={{ fontSize: 20, mr: 2 }} />
            <Typography>{name}</Typography>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default NavLinks;
