"use client";

import AddListingDrawer from "@/components/AddListingDrawer";
import DeleteModal from "@/components/Modals/DeleteModal";
import EditListingModal from "@/components/Modals/EditListingModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import { useStore } from "@/context/Store";
import { setImageQuality } from "@/utils/utils";
import { Cancel, DeleteForever, Edit, ThumbDown } from "@mui/icons-material";
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
  Modal,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
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
    valueGetter: (params) => params.row?.userId?.email,
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
    field: "rejected",
    headerName: "Reject",
    flex: 0.05,
    width: 50,
    renderCell: (params) => {
      const { rejectListings, unRejectListing } = useStore();
      const [open, setOpen] = useState(false);
      const [checked, setChecked] = useState(false);
      const [rejected, setRejected] = useState(params?.row?.rejected || false);
      const [message, setMessage] = useState("");

      useEffect(() => {
        if (checked) {
          setOpen(true);
        }
      }, [checked, rejected]);

      return (
        <>
          <Checkbox
            checked={rejected}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setChecked(isChecked);
              // If the checkbox is being unchecked, we'll un-reject the listing
              setRejected(isChecked);
              if (!isChecked) {
                setRejected(false); // Update local state
                unRejectListing(params?.row?._id, () => {}); // Un-reject the listing
              }
            }}
            color="error"
          />

          <Modal
            open={open}
            sx={{
              p: {
                xs: 2,
                sm: 4,
                md: 6,
                lg: 8,
                xl: 10,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                p: 2,
                width: {
                  xs: 300,
                  sm: 400,
                  md: 600,
                },
              }}
            >
              <Typography color="error" variant="h6">
                Reject {params?.row?.name}
              </Typography>
              <Typography variant="body1">
                Are you sure you want to reject{" "}
                <strong>{params?.row?.name}</strong>? It will send an email to
                the listing author!
              </Typography>

              <Typography color="error" variant="body1" sx={{ mt: 2, mb: 1 }}>
                Please provide a reason for rejecting{" "}
                <strong>{params?.row?.name}</strong>.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={`Reason why ${params?.row?.name} is deleted.`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Cancel />}
                  onClick={() => {
                    setOpen(false);
                    setChecked(false);
                    setRejected(params?.row?.rejected);
                    setMessage("");
                  }}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ThumbDown />}
                  color="error"
                  sx={{ flex: 1 }}
                  disabled={!message}
                  onClick={() => {
                    rejectListings(params?.row?._id, message, () => {
                      setOpen(false);
                      setChecked(false);
                      setMessage("");
                    });
                  }}
                >
                  Reject
                </Button>
              </Box>
            </Card>
          </Modal>
        </>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => {
      const { deleteListings } = useStore();
      const [open, setOpen] = useState(false);
      const [deleteOpen, setDeleteOpen] = useState(false);

      return (
        <strong>
          <IconButton onClick={() => setOpen(true)} color="success">
            <Edit />
          </IconButton>
          <IconButton onClick={() => setDeleteOpen(true)} color="error">
            <DeleteForever />
          </IconButton>

          <EditListingModal
            open={open}
            setOpen={setOpen}
            listing={params?.row}
          />
          <DeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            value={params?.row}
            handleDelete={deleteListings}
          />
        </strong>
      );
    },
    flex: 0.1,
  },
];

const Listings = () => {
  const { listings, fetchListings, fetchCategories, categories } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchCategories();
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
              <Select
                value={""}
                select
                labelId="category"
                label="Category"
                fullWidth
              >
                <MenuItem value={""}>Select Category</MenuItem>
                {categories?.documents?.map((category) => (
                  <MenuItem value={category?._id}>{category?.name}</MenuItem>
                ))}
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
