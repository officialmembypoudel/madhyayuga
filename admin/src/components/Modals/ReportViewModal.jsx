import { useStore } from "@/context/Store";
import { capitalizeFirstLetter } from "@/utils/utils";
import { Cancel, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
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
import React, { useEffect, useState } from "react";

const ReportViewModal = ({ open, setOpen, value }) => {
  const [report, setReport] = useState(value);
  const { updateReports, fetchReportMessages, reportMessages, updateLoading } =
    useStore();

  useEffect(() => {
    setReport(value);
    fetchReportMessages(value?._id);
  }, [value]);

  const handleClose = () => {
    setOpen(false);
    setReport(value);
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
        alignItems: {
          xs: "start",
          sm: "start",
          md: "start",
          lg: "center",
          xl: "center",
        },
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <Card sx={{ width: "100%", height: "auto", p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={7}>
            <Typography variant="h6">Report Details</Typography>
            <Box>
              <Avatar
                src={report?.image?.url}
                variant="rounded"
                sx={{ width: 300, height: "auto", aspectRatio: "auto" }}
              />
              <Typography variant="body1">
                <strong>Reported By:</strong> {report?.reporter?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Reporter Contact:</strong> {report?.contactEmail}
              </Typography>
              {report?.type?.toLowerCase() === "listing" ? (
                <>
                  <Typography variant="body1">
                    <strong>Reported Listing:</strong> {report?.listing?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Listing Created By:</strong>{" "}
                    {report?.listing?.userId?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Reported Listing Created At:</strong>{" "}
                    {new Date(report?.listing?.createdAt).toDateString()}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1">
                    <strong>Reported User:</strong>
                    {report?.reportedUser?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Reported User Contack:</strong>
                    {report?.reportedUser?.email}
                  </Typography>
                </>
              )}

              <Typography variant="body1">
                <strong>Reported At:</strong>{" "}
                {new Date(report?.createdAt).toDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Subject:</strong> {capitalizeFirstLetter(report?.title)}
              </Typography>
              <Typography variant="body1">
                <strong>Reason:</strong> {report?.description}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {capitalizeFirstLetter(report?.status)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={5} sx={{}}>
            <Typography variant="h6">Actions</Typography>
            <Box
              sx={{
                mb: 2,
                mt: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormControl sx={{ mb: 2 }} fullWidth>
                <InputLabel id="actions">Category</InputLabel>
                <Select
                  value={report?.status?.toLowerCase()}
                  select
                  labelId="actions"
                  label="Actions"
                  fullWidth
                  onChange={(e) =>
                    setReport({
                      ...report,
                      status: e.target.value.toLowerCase(),
                    })
                  }
                >
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"in process"}>In process</MenuItem>
                  <MenuItem value={"resolved"}>Resolved</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{ mb: 2, height: 300, width: "100%", overflowY: "auto" }}
              >
                <Typography variant="h6">Previous Actions</Typography>

                {reportMessages?.documents?.map((message) => (
                  <Card
                    key={message?._id}
                    sx={{ p: 2, mt: 2, bgcolor: "#add8e6" }}
                  >
                    <Typography variant="body1">
                      <strong>{capitalizeFirstLetter(message?.status)}</strong>
                    </Typography>
                    <Typography variant="body2">
                      {new Date(message?.createdAt).toDateString()}
                    </Typography>
                    <Typography variant="body1">{message?.message}</Typography>
                  </Card>
                ))}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  value={report?.message}
                  onChange={(e) =>
                    setReport({ ...report, message: e.target.value })
                  }
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: 300,
            ml: "auto",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
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
            disabled={!report?.message}
            onClick={() => {
              updateReports(report?._id, report);
              !updateLoading && handleClose();
            }}
            loading={updateLoading}
          >
            Save
          </LoadingButton>
        </Box>
      </Card>
    </Modal>
  );
};

export default ReportViewModal;
