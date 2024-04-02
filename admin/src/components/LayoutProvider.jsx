"use client";
import { Box, Drawer, Typography } from "@mui/material";
import React from "react";
import NavLinks from "./NavLinks";
import { usePathname } from "next/navigation";

const LayoutProvider = (props) => {
  const pathname = usePathname();
  return (
    <Box>
      {pathname !== "/auth" && (
        <Drawer variant="permanent">
          <Box sx={{ width: 200, height: "100%", padding: 1 }}>
            <Typography align="center" sx={{ fontWeight: "medium" }}>
              Madhyayuga
            </Typography>
            <NavLinks />
          </Box>
        </Drawer>
      )}
      <div style={{ marginLeft: pathname !== "/auth" ? 200 : 0 }}>
        {props.children}
      </div>
    </Box>
  );
};

export default LayoutProvider;
