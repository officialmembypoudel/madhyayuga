"use client";

import React, { useEffect } from "react";
import { DeleteForever, Edit, RemoveRedEye } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useStore } from "@/context/Store";
import { capitalizeFirstLetter, setImageQuality } from "@/utils/utils";
import ReportViewModal from "@/components/Modals/ReportViewModal";

const Reports = () => {
  const { fetchReports, reports } = useStore();
  const [open, setOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Card sx={{ mt: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h4">All Reports</Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={2}></Grid>
          <Grid item sm={12} md={3}>
            <TextField
              label="Search"
              placeholder="search for report"
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category">Category</InputLabel>
              <Select select labelId="category" label="Category" fullWidth>
                <MenuItem value={10}>User</MenuItem>
                <MenuItem value={110}>Listing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {reports?.documents?.map((report) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
            <Card>
              <Box
                sx={{
                  padding: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "start",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{ width: 130, height: 130 }}
                    src={setImageQuality(report?.image?.url, 20)}
                  />
                  <Box sx={{ mr: "auto" }}>
                    <Typography variant="h6">
                      {capitalizeFirstLetter(report?.title)}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(report?.createdAt).toDateString()}
                    </Typography>
                    <Typography variant="body1">
                      {capitalizeFirstLetter(report?.type)}
                    </Typography>
                    <Chip label={report?.status} size="small" color="info" />
                    {/* <Typography variant="body2">{report?.status}</Typography> */}

                    <IconButton
                      onClick={() => {
                        setSelectedReport(report);

                        setOpen(true);
                      }}
                      color="info"
                    >
                      <RemoveRedEye />
                    </IconButton>
                  </Box>
                  <IconButton color="error">
                    <DeleteForever />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ReportViewModal open={open} setOpen={setOpen} value={selectedReport} />
    </Box>
  );
};

export default Reports;
