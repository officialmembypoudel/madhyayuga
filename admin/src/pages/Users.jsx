"use client";

import DeleteModal from "@/components/Modals/DeleteModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import { useStore } from "@/context/Store";
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
import React, { useEffect } from "react";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 100,
    editable: true,
    flex: 0.2,
    renderCell: (params) => {
      return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar src={params?.row?.avatar?.url} />
          <Typography variant="body2">{params.row?.name}</Typography>
        </Box>
      );
    },
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 100,
    editable: true,
    flex: 0.1,
  },
  {
    field: "email",
    headerName: "Email",
    width: 100,
    editable: true,
    flex: 0.15,
  },
  {
    field: "email",
    headerName: "Email",
    width: 100,
    editable: true,
    flex: 0.15,
  },

  {
    field: "verified",
    headerName: "Verified",
    width: 100,
    editable: true,
    flex: 0.1,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => {
      const [open, setOpen] = React.useState(false);
      const [deleteOpen, setDeleteOpen] = React.useState(false);
      return (
        <strong>
          <IconButton onClick={() => setOpen(true)} color="success">
            <Edit />
          </IconButton>
          <IconButton onClick={() => setDeleteOpen(true)} color="error">
            <DeleteForever />
          </IconButton>

          <EditUserModal open={open} setOpen={setOpen} user={params?.row} />
          <DeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            value={params?.row}
          />
        </strong>
      );
    },
    flex: 0.05,
  },
];

const Users = () => {
  const { users, fetchUsers } = useStore();

  console.log(users, "users page");

  useEffect(() => {
    fetchUsers();
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
              <Typography variant="h4">All Users</Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={3}></Grid>
          <Grid item sm={12} md={3}>
            <TextField label="Search" placeholder="search for user" fullWidth />
          </Grid>

          <Grid item sm={12} md={2}>
            <Button
              disableElevation
              variant="contained"
              color="primary"
              sx={{ height: 56 }}
              fullWidth
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ height: 400, width: "100%", mt: 5 }}>
        <DataGrid
          rows={users?.documents || []}
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
    </Box>
  );
};

export default Users;
