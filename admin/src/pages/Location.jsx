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
  GpsFixed,
  LocationCity,
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
    field: "city",
    headerName: "City",
    flex: 0.15,
    editable: false,
  },

  {
    field: "latitude",
    headerName: "Latitude",
    flex: 0.15,
    editable: false,
  },
  {
    field: "longitude",
    headerName: "Longitude",
    flex: 0.15,
    editable: false,
  },

  {
    field: "actions",
    headerName: "Actions",
    flex: 0.1,
    renderCell: (params) => {
      const { setSelectedLocation } = useStore();
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            color="info"
            onClick={() => setSelectedLocation(params?.row)}
          >
            <RemoveRedEye />
          </IconButton>
        </Box>
      );
    },
  },
];

const Location = () => {
  const {
    selectedLocation,
    locations,
    setSelectedLocation,
    fetchLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationListingCount,
  } = useStore();
  const [query, setQuery] = useState("");
  const [allLocations, setAllLocations] = useState({ documents: [] });
  const [location, setLocation] = useState({
    city: "",
    latitude: "",
    longitude: "",
  });

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    setAllLocations({ ...locations });
  }, [locations]);

  useEffect(() => {
    if (!isEditing) return;
    setEditedLocation({ ...selectedLocation });
  }, [isEditing, selectedLocation]);

  useEffect(() => {
    const getCount = async () => {
      try {
        const ccount = await getLocationListingCount(selectedLocation?.city);
        setCount(ccount);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedLocation) {
      getCount();
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (query) {
      const filteredLocations = allLocations?.documents?.filter((location) =>
        location.city.toLowerCase().includes(query.toLowerCase())
      );
      setAllLocations({ documents: filteredLocations });
    } else {
      setAllLocations(locations);
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
              <Typography variant="h4">All Locations</Typography>
            </Box>
          </Grid>
          <Grid item sm={12} md={4}>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              label="Search"
              placeholder="search for location"
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
              rows={allLocations?.documents || []}
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
                  Edit {selectedLocation?.name}
                </Typography>
                <Box sx={{ mt: 4, mb: "auto" }}>
                  <TextField
                    label="Name"
                    fullWidth
                    InputProps={{ endAdornment: <LocationCity /> }}
                    placeholder="City Name"
                    sx={{ mb: 2 }}
                    value={editedLocation.city}
                    onChange={(e) =>
                      setEditedLocation({
                        ...editedLocation,
                        city: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Longitude"
                    fullWidth
                    InputProps={{ endAdornment: <GpsFixed /> }}
                    placeholder="Longitude of the city"
                    sx={{ mb: 2 }}
                    value={editedLocation.longitude}
                    onChange={(e) =>
                      setEditedLocation({
                        ...editedLocation,
                        longitude: e.target.value,
                      })
                    }
                    type="number"
                  />
                  <TextField
                    label="Color"
                    fullWidth
                    InputProps={{ endAdornment: <GpsFixed /> }}
                    placeholder="Latitude of the city"
                    sx={{ mb: 2 }}
                    value={editedLocation.latitude}
                    onChange={(e) =>
                      setEditedLocation({
                        ...editedLocation,
                        latitude: e.target.value,
                      })
                    }
                    type="number"
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
                      setEditedLocation(selectedLocation);
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
                      await updateLocation(editedLocation, () => {});
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            </form>
          </Grid>
        ) : !selectedLocation ? (
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
                <Typography variant="h6">Add City</Typography>
                <Box sx={{ mt: 4, mb: "auto" }}>
                  <TextField
                    label="Name"
                    fullWidth
                    InputProps={{ endAdornment: <LocationCity /> }}
                    placeholder="City Name"
                    sx={{ mb: 2 }}
                    value={location.city}
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        city: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Longitude"
                    fullWidth
                    InputProps={{ endAdornment: <GpsFixed /> }}
                    placeholder="Longitude of the city"
                    sx={{ mb: 2 }}
                    value={location.longitude}
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        longitude: e.target.value,
                      })
                    }
                    type="number"
                  />
                  <TextField
                    label="Color"
                    fullWidth
                    InputProps={{ endAdornment: <GpsFixed /> }}
                    placeholder="Latitude of the city"
                    sx={{ mb: 2 }}
                    value={location.latitude}
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        latitude: e.target.value,
                      })
                    }
                    type="number"
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
                      setLocation({
                        city: "",
                        latitude: "",
                        longitude: "",
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
                      addLocation(location, () => {
                        setLocation({
                          city: "",
                          latitude: "",
                          longitude: "",
                        });
                      });
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
                  City- {selectedLocation?.city || "Select a location"}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => {
                    setSelectedLocation(null);
                  }}
                >
                  <Cancel />
                </IconButton>
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
                  <Typography variant="body1">Location Details</Typography>
                  <Typography variant="body2">
                    <strong>City:</strong> {selectedLocation?.city}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Latitude:</strong> {selectedLocation?.latitude}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Longitude:</strong> {selectedLocation?.longitude}
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
                  value={selectedLocation}
                  handleDelete={() => deleteLocation(selectedLocation?._id)}
                  type={"location"}
                />
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Location;
