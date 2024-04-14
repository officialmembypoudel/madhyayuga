import { MenuItem } from "@mui/base";
import { Cancel, Edit, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const EditUserModal = ({ open, setOpen, user }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleClose = () => {
    setEditedUser(user);
    setOpen(false);
  };
  return (
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
      <Card sx={{ p: 2, width: 350 }}>
        <Typography sx={{ mb: 4 }} variant="h4">
          Edit {user?.name}
        </Typography>

        <TextField
          sx={{ mb: 2 }}
          label="Name"
          fullWidth
          variant="outlined"
          value={editedUser?.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <TextField
          sx={{ mb: 2 }}
          label="Email"
          fullWidth
          variant="outlined"
          value={editedUser?.email}
          onChange={(e) =>
            setEditedUser({ ...editedUser, email: e.target.value })
          }
        />
        <TextField
          sx={{ mb: 2 }}
          label="Phone"
          fullWidth
          variant="outlined"
          value={editedUser?.phone}
          onChange={(e) =>
            setEditedUser({ ...editedUser, phone: e.target.value })
          }
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            sx={{ flex: 1 }}
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            sx={{ flex: 1 }}
            variant="contained"
            color="success"
            startIcon={<Save />}
            disabled={
              !editedUser?.name || !editedUser?.email || !editedUser?.phone
            }
          >
            Save
          </LoadingButton>
        </Box>
      </Card>
    </Modal>
  );
};

export default EditUserModal;
