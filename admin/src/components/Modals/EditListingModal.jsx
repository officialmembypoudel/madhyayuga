import { Cancel, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const EditListingModal = ({ open, setOpen, listing }) => {
  const [editedlisting, setEditedlisting] = useState(listing);

  const handleClose = () => {
    setEditedlisting(listing);
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
          Edit {listing?.name}
        </Typography>

        <TextField
          sx={{ mb: 2 }}
          label="Name"
          fullWidth
          variant="outlined"
          value={editedlisting?.name}
          onChange={(e) =>
            setEditedlisting({ ...editedlisting, name: e.target.value })
          }
        />
        <TextField
          sx={{ mb: 2 }}
          label="With"
          fullWidth
          variant="outlined"
          value={editedlisting?.with}
          onChange={(e) =>
            setEditedlisting({ ...editedlisting, with: e.target.value })
          }
        />
        <TextField
          sx={{ mb: 2 }}
          label="Condition"
          fullWidth
          variant="outlined"
          value={editedlisting?.condition}
          onChange={(e) =>
            setEditedlisting({ ...editedlisting, condition: e.target.value })
          }
        />
        <TextField
          sx={{ mb: 2 }}
          label="Location"
          fullWidth
          variant="outlined"
          value={editedlisting?.location}
          onChange={(e) =>
            setEditedlisting({ ...editedlisting, location: e.target.value })
          }
        />

        <FormControl sx={{ mb: 2 }} fullWidth>
          <InputLabel id="category">Category</InputLabel>
          <Select
            value={editedlisting?.categoryId}
            select
            labelId="category"
            label="Category"
            fullWidth
            onChange={(e) =>
              setEditedlisting({ ...editedlisting, categoryId: e.target.value })
            }
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={editedlisting?.categoryId}>
              {editedlisting?.categoryId}
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          value={editedlisting?.description}
          onChange={(e) =>
            setEditedlisting({ ...editedlisting, description: e.target.value })
          }
          sx={{ mb: 2 }}
          label="Description"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
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
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            color="success"
            startIcon={<Save />}
            disabled={
              !editedlisting?.name ||
              !editedlisting?.description ||
              !editedlisting?.location ||
              !editedlisting?.condition ||
              !editedlisting?.with ||
              !editedlisting?.categoryId
            }
          >
            Save
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default EditListingModal;
