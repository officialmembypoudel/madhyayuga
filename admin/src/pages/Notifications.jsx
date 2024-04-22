"use client";

import client from "@/config";
import { ClearAll, NotificationAddOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    try {
      setLoading(true);
      const response = await client.post(
        "/users/notify",
        {
          title: notification.title,
          body: notification.body,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setNotifications([response.data.document, ...notifications]);
      response.data && setNotification({ title: "", body: "" });
      response.data && setLoading(false);
    } catch (error) {
      console.log(error.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await client.get("/users/notifications/get", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setNotifications(response.data.documents);
    } catch (error) {
      console.log(error.response.data, "error from fetchNotifications");
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">Send Push Notifications</Typography>
      <Box
        sx={{
          mt: {
            xs: 4,
            sm: 7,
            md: 10,
            lg: 14,
          },
          width: {
            xs: "100%",
            sm: "90%",
            md: "80%",
            lg: "60%",
          },
          mx: "auto",
        }}
      >
        <Card sx={{ p: 2 }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              sx={{ mb: 2 }}
              label="Notification Title"
              fullWidth
            />
            <TextField
              value={notification.body}
              onChange={(e) =>
                setNotification({ ...notification, body: e.target.value })
              }
              sx={{ mb: 2 }}
              label="Notification Body"
              fullWidth
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-around", gap: 5 }}
            >
              <Box sx={{ flex: 1 }}></Box>
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                startIcon={<ClearAll />}
                color="error"
                onClick={() => setNotification({ title: "", body: "" })}
              >
                Clear
              </Button>
              <Button
                loading={loading}
                type="submit"
                onClick={sendNotification}
                disabled={!notification.title || !notification.body}
                sx={{ flex: 1 }}
                variant="contained"
                startIcon={<NotificationAddOutlined />}
                color="success"
              >
                Notify
              </Button>
            </Box>
          </form>
        </Card>
      </Box>
      <Box
        sx={{
          mt: 1,

          width: {
            xs: "100%",
            sm: "90%",
            md: "80%",
            lg: "60%",
          },
          mx: "auto",

          overflowY: "auto",
          px: 2,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">History</Typography>
      </Box>

      <Box
        sx={{
          mt: 1,
          flex: 1,

          width: {
            xs: "100%",
            sm: "90%",
            md: "80%",
            lg: "60%",
          },
          mx: "auto",

          overflowY: "auto",
          p: 2,
          borderRadius: 1,
        }}
      >
        <Box sx={{ mt: 2 }}>
          {notifications?.map((notification, index) => (
            <Card key={index} sx={{ p: 1, mb: 2 }}>
              <Typography variant="h6">{notification.title}</Typography>
              <Typography variant="body1">{notification.body}</Typography>
              <Typography
                sx={{ fontWeight: "100", fontSize: 12 }}
                variant="body2"
              >
                {new Date(notification.createdAt).toDateString()}{" "}
                {new Date(notification.createdAt).toLocaleTimeString()}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;
