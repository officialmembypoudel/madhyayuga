import { Cancel, DeleteForever } from "@mui/icons-material";
import { Box, Button, Card, Modal, Typography, TextField } from "@mui/material";
import React from "react";

const DeleteModal = ({ open, setOpen, value, handleDelete }) => {
  const [message, setMessage] = React.useState("");
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
      <Card
        sx={{
          p: 2,
          width: {
            xs: 300,
            sm: 400,
            md: 500,
          },
        }}
      >
        <Typography color="error" variant="h6">
          Delete {value?.name}
        </Typography>
        <Typography variant="body1">
          Are you sure you want to delete <strong>{value?.name}</strong>? You
          cannot undo this action!
        </Typography>

        <Typography color="error" variant="body1" sx={{ mt: 2, mb: 1 }}>
          Please provide a reason for deleting this{" "}
          <strong>{value?.name}</strong>.
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder={`Reason why ${value?.name} is deleted.`}
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
            onClick={() => setOpen(false)}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<DeleteForever />}
            color="error"
            sx={{ flex: 1 }}
            disabled={!message}
            onClick={() => {
              handleDelete(value?._id, message);
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default DeleteModal;
