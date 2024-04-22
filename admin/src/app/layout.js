import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import { Box, Drawer, List, Typography } from "@mui/material";
import NavLinks from "@/components/NavLinks";
import StoreProvider from "@/context/Store";
import "material-icons/iconfont/material-icons.css";
import { headers } from "next/headers";
import LayoutProvider from "@/components/LayoutProvider";
import AuthContext from "@/context/AuthContext";

export default function RootLayout(props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        <title>Madhyayuga</title>
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AuthContext>
            <StoreProvider>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <LayoutProvider>{props.children}</LayoutProvider>
              </ThemeProvider>
            </StoreProvider>
          </AuthContext>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
