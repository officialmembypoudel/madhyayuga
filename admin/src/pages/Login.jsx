"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Box,
  Button,
  Card,
  Grid,
  Hidden,
  TextField,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password, "/dashboard");
  };

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Grid container>
        <Hidden mdDown>
          <Grid item xs={12} md={5} sx={{ height: "100vh", display: "flex" }}>
            <Card sx={{ m: 1, flex: 1, bgcolor: blue[100] }}>
              <Box sx={{ p: 2 }}>
                <Typography align="center" sx={{ fontWeight: "medium" }}>
                  Login
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Hidden>
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box sx={{ m: 0.5, width: 370 }}>
            <Typography
              align="center"
              variant="h4"
              sx={{ fontWeight: "medium" }}
            >
              Madhyayuga
            </Typography>
            <Typography variant="h6" sx={{ mt: 4, color: "#dc3545" }}>
              Hey,
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Login Now.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                placeholder="enter your email"
                fullWidth
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                placeholder="enter your password"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                size="large"
                color="success"
                sx={{ mt: 2 }}
                type="submit"
              >
                Login
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
