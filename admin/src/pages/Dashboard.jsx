"use client";
import { useStore } from "@/context/Store";
import {
  Category,
  ListAlt,
  LocationCity,
  Person,
  Person2,
} from "@mui/icons-material";
import { Box, Card, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const {
    listings,
    categories,
    locations,
    users,
    reports,
    fetchReports,
    fetchListings,
    fetchCategories,
    fetchUsers,
    fetchLocations,
  } = useStore();
  const [newUsers, setNewUsers] = useState(0);

  useEffect(() => {
    fetchListings();
    fetchCategories();
    fetchReports();
    fetchUsers();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (users) {
      setNewUsers(countNewUsers(users.documents));
    }
  }, [users]);

  function countNewUsers(users) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h4">
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ p: 5 }}>
            <ListAlt sx={{ fontSize: 50, width: "100%" }} />
            <Typography align="center" variant="h5">
              {listings?.documents?.length} Listings
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ p: 5 }}>
            <Category sx={{ fontSize: 50, width: "100%" }} />
            <Typography align="center" variant="h5">
              {categories?.documents?.length} Categories
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ p: 5 }}>
            <LocationCity sx={{ fontSize: 50, width: "100%" }} />
            <Typography align="center" variant="h5">
              {locations?.documents?.length} Locations
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ p: 5 }}>
            <Person2 sx={{ fontSize: 50, width: "100%" }} />
            <Typography align="center" variant="h5">
              {users?.documents?.length} Users
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ p: 5 }}>
            <Person2 sx={{ fontSize: 50, width: "100%" }} />
            <Typography align="center" variant="h5">
              {newUsers} New Users in the last 30 days
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
