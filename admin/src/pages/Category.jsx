"use client";
import DeleteModal from "@/components/Modals/DeleteModal";
import { useStore } from "@/context/Store";
import { replaceHyphens } from "@/utils/utils";
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
          <Icon style={{ color: params.row?.color }}>
            {replaceHyphens(params?.row?.icon)}
          </Icon>
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
      const { selectCategory, deleteCategories } = useStore();
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton color="info" onClick={() => selectCategory(params?.row)}>
            <RemoveRedEye />
          </IconButton>
          {/* <IconButton
            onClick={() => deleteCategories(params?.row?._id)}
            color="error"
          >
            <DeleteForever />
          </IconButton> */}
        </Box>
      );
    },
  },
];

const Category = () => {
  const {
    categories,
    fetchCategories,
    selectedCategory,
    selectCategory,
    addcategory,
    getCategoryListingCount,
    deleteCategories,
    updateCategories,
    setSelectedCategory,
  } = useStore();
  const [query, setQuery] = useState("");
  const [allCategories, setAllCategories] = useState({ documents: [] });
  const [category, setCategory] = useState({
    name: "",
    icon: "",
    iconFamily: "material",
    color: "",
  });
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setAllCategories({ ...categories });
  }, [categories]);

  useEffect(() => {
    if (!isEditing) return;
    setEditedCategory({ ...selectedCategory, iconFamily: "material" });
  }, [isEditing, selectedCategory]);

  useEffect(() => {
    const getCount = async () => {
      try {
        const ccount = await getCategoryListingCount(selectedCategory?._id);
        setCount(ccount);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedCategory) {
      getCount();
    }
  }, [selectedCategory]);

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
        {isEditing ? (
          <Grid item sm={12} md={5}>
            <form onSubmit={(e) => e.preventDefault()}>
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
                <Typography variant="h6">
                  Edit {selectedCategory?.name}
                </Typography>
                <Box sx={{ mt: 4, mb: "auto" }}>
                  <TextField
                    label="Name"
                    fullWidth
                    InputProps={{ endAdornment: <CategoryOutlined /> }}
                    placeholder="Category Name"
                    sx={{ mb: 2 }}
                    value={editedCategory.name}
                    onChange={(e) =>
                      setEditedCategory({
                        ...editedCategory,
                        name: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Icon Name"
                    fullWidth
                    InputProps={{ endAdornment: <AppsOutlined /> }}
                    placeholder="Icon Name in snake-case"
                    sx={{ mb: 2 }}
                    value={editedCategory.icon}
                    onChange={(e) =>
                      setEditedCategory({
                        ...editedCategory,
                        icon: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Color"
                    fullWidth
                    InputProps={{ endAdornment: <PaletteOutlined /> }}
                    placeholder="Icon Color HEX or RGB"
                    sx={{ mb: 2 }}
                    value={editedCategory.color}
                    onChange={(e) =>
                      setEditedCategory({
                        ...editedCategory,
                        color: e.target.value,
                      })
                    }
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
                    startIcon={<Cancel />}
                    fullWidth
                    onClick={() => {
                      setEditedCategory(selectedCategory);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Save />}
                    fullWidth
                    type="submit"
                    onClick={async () => {
                      const category = await updateCategories(
                        editedCategory,
                        () => {
                          setIsEditing(false);
                        }
                      );
                      setSelectedCategory(category);
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            </form>
          </Grid>
        ) : !selectedCategory ? (
          <Grid item sm={12} md={5}>
            <form onSubmit={(e) => e.preventDefault()}>
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
                    value={category.name}
                    onChange={(e) =>
                      setCategory({ ...category, name: e.target.value })
                    }
                  />
                  <TextField
                    label="Icon Name"
                    fullWidth
                    InputProps={{ endAdornment: <AppsOutlined /> }}
                    placeholder="Icon Name in snake-case"
                    sx={{ mb: 2 }}
                    value={category.icon}
                    onChange={(e) =>
                      setCategory({ ...category, icon: e.target.value })
                    }
                  />
                  <TextField
                    label="Color"
                    fullWidth
                    InputProps={{ endAdornment: <PaletteOutlined /> }}
                    placeholder="Icon Color HEX or RGB"
                    sx={{ mb: 2 }}
                    value={category.color}
                    onChange={(e) =>
                      setCategory({ ...category, color: e.target.value })
                    }
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
                    onClick={() => {
                      setCategory({
                        iconFamily: "material",
                        name: "",
                        icon: "",
                        color: "",
                      });
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Save />}
                    fullWidth
                    type="submit"
                    onClick={() => {
                      addcategory(
                        category,
                        setCategory({
                          iconFamily: "material",
                          name: "",
                          icon: "",
                          color: "",
                        })
                      );
                    }}
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
                    {replaceHyphens(selectedCategory?.icon)}
                  </Icon>
                  <i className="electric-car"></i>
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
                    {count}
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
                  disabled={count > 0}
                  onClick={() => setOpen(true)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Edit />}
                  fullWidth
                  type="submit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <DeleteModal
                  open={open}
                  setOpen={setOpen}
                  value={selectedCategory}
                  handleDelete={() => deleteCategories(selectedCategory?._id)}
                  type={"category"}
                />
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Category;
