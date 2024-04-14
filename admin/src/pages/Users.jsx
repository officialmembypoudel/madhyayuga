"use client";

import DeleteModal from "@/components/Modals/DeleteModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import { useStore } from "@/context/Store";
import { ThumbDown, Edit, Cancel, DeleteForever } from "@mui/icons-material";
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
  Checkbox,
  Modal,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

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
    field: "verified",
    headerName: "Verified",
    width: 100,
    editable: true,
    flex: 0.1,
  },
  {
    field: "suspended",
    headerName: "Suspend",
    flex: 0.05,
    width: 50,
    renderCell: (params) => {
      const { suspendUser, unsuspendedUser } = useStore();
      const [open, setOpen] = useState(false);
      const [checked, setChecked] = useState(false);
      const [rejected, setRejected] = useState(params?.row?.suspended || false);
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
                unsuspendedUser(params?.row?._id, () => {}); // Un-reject the listing
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
                Are you sure you want to suspend{" "}
                <strong>{params?.row?.name}</strong>? It will send an email to
                the user!
              </Typography>

              <Typography color="error" variant="body1" sx={{ mt: 2, mb: 1 }}>
                Please provide a reason for Suspending{" "}
                <strong>{params?.row?.name}</strong>.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={`Reason why ${params?.row?.name} is suspended.`}
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
                    suspendUser(params?.row?._id, message, () => {
                      setOpen(false);
                      setChecked(false);
                      setMessage("");
                    });
                  }}
                >
                  Suspend
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
      const { deleteUser } = useStore();
      const [open, setOpen] = React.useState(false);
      const [deleteOpen, setDeleteOpen] = React.useState(false);
      return (
        <strong>
          <IconButton onClick={() => setDeleteOpen(true)} color="error">
            <DeleteForever />
          </IconButton>

          <DeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            value={params?.row}
            handleDelete={deleteUser}
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
