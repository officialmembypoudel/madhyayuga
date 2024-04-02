"use client";
import { useStore } from "@/context/Store";
import {
  AppsOutlined,
  Cancel,
  CategoryOutlined,
  Clear,
  ClearAll,
  DeleteForever,
  Edit,
  Palette,
  PaletteOutlined,
  RemoveRedEye,
  Save,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { red, yellow } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 0.2,
    editable: false,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar variant="square" sx={{ bgcolor: "#fff", borderRadius: 1 }}>
          <Icon style={{ color: params.row?.color }}>{params.row?.icon}</Icon>
        </Avatar>
        <Typography variant="body2">{params.row?.name}</Typography>
      </Box>
    ),
  },

  {
    field: "iconFamily",
    headerName: "Icon Family",
    flex: 0.15,
    editable: false,
  },
  {
    field: "createdAt",
    headerName: "Created",
    flex: 0.15,
    editable: false,
    valueGetter: (params) => new Date(params.row?.createdAt).toDateString(),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.1,
    renderCell: (params) => {
      const { selectCategory } = useStore();
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton color="info" onClick={() => selectCategory(params?.row)}>
            <RemoveRedEye />
          </IconButton>
          <IconButton color="error">
            <DeleteForever />
          </IconButton>
        </Box>
      );
    },
  },
];

const Category = () => {
  const { categories, fetchCategories, selectedCategory, selectCategory } =
    useStore();
  const [query, setQuery] = useState("");
  const [allCategories, setAllCategories] = useState({ documents: [] });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setAllCategories({ ...categories });
  }, [categories]);
  console.warn(selectedCategory);
  useEffect(() => {
    if (query) {
      const filteredCategories = allCategories?.documents?.filter((category) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setAllCategories({ documents: filteredCategories });
    } else {
      setAllCategories(categories);
    }
  }, [query]);

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ mt: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={8}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h4">All Categories</Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={4}>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              label="Search"
              placeholder="search for category"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Card>
      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid item sm={12} md={7}>
          <Card sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={allCategories?.documents || []}
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
        </Grid>
        {!selectedCategory ? (
          <Grid item sm={12} md={5}>
            <form>
              <Card
                sx={{
                  height: 400,
                  width: "100%",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">Add Category</Typography>
                <Box sx={{ mt: 4, mb: "auto" }}>
                  <TextField
                    label="Name"
                    fullWidth
                    InputProps={{ endAdornment: <CategoryOutlined /> }}
                    placeholder="Category Name"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Icon Name"
                    fullWidth
                    InputProps={{ endAdornment: <AppsOutlined /> }}
                    placeholder="Icon Name in snake-case"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Color"
                    fullWidth
                    InputProps={{ endAdornment: <PaletteOutlined /> }}
                    placeholder="Icon Color HEX or RGB"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ClearAll />}
                    fullWidth
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Save />}
                    fullWidth
                    type="submit"
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            </form>
          </Grid>
        ) : (
          <Grid item sm={12} md={5}>
            <Card
              sx={{
                height: 400,
                width: "100%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Category- {selectedCategory?.name || "Select a category"}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => {
                    console.warn("clicked");
                    selectCategory(null);
                  }}
                >
                  <Cancel />
                </IconButton>
              </Box>
              <Box sx={{ alignSelf: "center", mt: 1 }}>
                <Avatar
                  variant="square"
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "#fff",
                    borderRadius: 1,
                  }}
                >
                  <Icon
                    sx={{ color: selectedCategory?.color }}
                    style={{ fontSize: 80 }}
                  >
                    {selectedCategory?.icon}
                  </Icon>
                </Avatar>
              </Box>
              <Box
                sx={{
                  alignSelf: "start",
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="body1">Category Details</Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedCategory?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Icon:</strong> {selectedCategory?.icon}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Color:</strong> {selectedCategory?.color}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Created:</strong>{" "}
                    {new Date(selectedCategory?.createdAt).toDateString()}
                  </Typography>
                </Box>
                <Card
                  sx={{
                    p: 3,
                    bgcolor: red[200],
                    border: "2px solid #dc3545",
                  }}
                >
                  <Typography
                    color={"#1a1a1a"}
                    textAlign={"center"}
                    variant="body1"
                  >
                    5
                  </Typography>
                  <Typography
                    color={"#1a1a1a"}
                    textAlign={"center"}
                    variant="body2"
                  >
                    Listings
                  </Typography>
                </Card>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForever />}
                  fullWidth
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Edit />}
                  fullWidth
                  type="submit"
                >
                  Edit
                </Button>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Category;
