"use client";

import AddListingDrawer from "@/components/AddListingDrawer";
import { useStore } from "@/context/Store";
import { setImageQuality } from "@/utils/utils";
import { DeleteForever, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
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
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const columns = [
  {
    field: "name",
    headerName: "Name",
    minWidth: 150,
    editable: true,
    flex: 0.2,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Avatar
          variant="square"
          sx={{ borderRadius: 1, bgcolor: "#fff" }}
          src={setImageQuality(params.row?.images[0]?.url, 20)}
        />
        <Typography variant="body2">{params.row?.name}</Typography>
      </Box>
    ),
  },
  {
    field: "userId",
    headerName: "User",
    width: 100,
    editable: true,
    valueGetter: (params) => params.row?.userId?.name,
    flex: 0.15,
  },
  {
    field: "with",
    headerName: "With",
    width: 150,
    editable: true,
    flex: 0.2,
  },
  {
    field: "categoryId",
    headerName: "Category",
    width: 150,
    editable: true,
    flex: 0.1,
  },
  {
    field: "location",
    headerName: "Location",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 100,
    flex: 0.1,
  },
  {
    field: "condition",
    headerName: "Condition",
    width: 100,
    editable: true,
    flex: 0.1,
  },

  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    editable: true,
    valueGetter: (params) => new Date(params.row?.createdAt).toDateString(),
    flex: 0.1,
  },

  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => (
      <strong>
        <IconButton color="success">
          <Edit />
        </IconButton>
        <IconButton color="error">
          <DeleteForever />
        </IconButton>
      </strong>
    ),
    flex: 0.1,
  },
];

const Listings = () => {
  const { listings, fetchListings } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchListings();
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
              <Typography variant="h4">All Listings</Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={3}>
            <TextField
              label="Search"
              placeholder="search for listing"
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category">Category</InputLabel>
              <Select select labelId="category" label="Category" fullWidth>
                <MenuItem value={10}>Ten</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item sm={12} md={2}>
            <Button
              disableElevation
              variant="contained"
              color="primary"
              sx={{ height: 56 }}
              fullWidth
              onClick={() => setOpen(true)}
            >
              Add Listing
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ height: 400, width: "100%", mt: 5 }}>
        <DataGrid
          rows={listings?.documents || []}
          columns={columns}
          getRowId={(row) => row?._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Card>

      <AddListingDrawer open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Listings;
