"use client";

import { Cancel, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const AddListingDrawer = ({ open, setOpen }) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} variant="temporary" anchor="right">
      <Box
        sx={{
          width: 300,
          height: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pb: 5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Add Listing
          </Typography>
          <TextField
            label="Name"
            placeholder="Listing Name"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="With"
            placeholder="With what?"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Condition"
            placeholder="Condition of item"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category">Category</InputLabel>
            <Select select labelId="category" label="Category" fullWidth>
              <MenuItem value={10}>Ten</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location">Location</InputLabel>
            <Select select labelId="location" label="location" fullWidth>
              <MenuItem value={10}>Ten</MenuItem>
            </Select>
          </FormControl>
          <TextField
            multiline
            rows={4}
            maxRows={4}
            label="Description"
            placeholder="Description"
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            startIcon={<Cancel />}
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            startIcon={<Save />}
            fullWidth
            variant="contained"
            color="success"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddListingDrawer;
