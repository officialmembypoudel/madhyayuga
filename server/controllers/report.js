import { reportModel } from "../models/report.js";
import { reportMessagesModel } from "../models/reportMessages.js";
import { sendMail } from "../utils/sendMail.js";

export const addReport = async (req, res) => {
  try {
    const { title, description, reportedUser, contactEmail } = req.body;
    const reporter = req.user._id;
    req.body.reporter = reporter;
    const image = req.file ?? null;
    console.log(req.file, "file");
    if (!title || !description || !reporter || !contactEmail) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (reporter === reportedUser) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot report yourself" });
    }

    if (reportedUser) {
      req.body.type = "user";
      if (!req.body.reportedUser) {
        return res.status(400).json({
          success: false,
          message: "Reported user is required to report!",
        });
      }
    } else {
      req.body.type = "listing";
      if (!req.body.listing) {
        return res.status(400).json({
          success: false,
          message: "Listing is required to report listing!",
        });
      }
    }

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const report = await reportModel.create({
      ...req.body,
      image: {
        public_id: image?.filename,
        url: image?.path,
      },
    });
    sendMail(
      contactEmail,
      "Report Received",
      `Your report with title ${title} has been received. We will get back to you soon.`
    );
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getReports = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      const allReports = await reportModel
        .find()
        .populate({
          path: "listing",
          select: "name createdAt images with",
          populate: { path: "userId", model: "user" },
        })
        .populate({
          path: "reportedUser",
          select: "name email avatar phone",
        });

      return res.status(200).json({ success: true, documents: allReports });
    }

    const reports = await reportModel
      .find({ type })
      .populate({
        path: "listing",
        select: "name createdAt images with",
        populate: { path: "userId", model: "user" },
      })
      .populate({
        path: "reportedUser",
        select: "name email avatar phone",
      });
    res.status(200).json({ success: true, documents: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    const report = await reportModel
      .findById(id)
      .populate({
        path: "listing",
        select: "name createdAt images with",
        populate: { path: "userId", model: "user" },
      })
      .populate({
        path: "reportedUser",
        select: "name email avatar phone",
      });
    const reportMessages = await reportMessagesModel.find({ report: id });
    report.messages = reportMessages;
    res.status(200).json({ success: true, document: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    req.body.lastUpdated = Date.now();

    const report = await reportModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    sendMail(
      report.contactEmail,
      "Report Updated",
      `Your report with title ${report.title} has been updated.
      
      New Status: ${req.body.status}
      
      Description: ${req.body.message}`
    );

    const reportMessage = await reportMessagesModel.create({
      report: id,
      message: req.body.message,
      contactEmail: report.contactEmail,
    });

    reportMessage.save();
    res
      .status(201)
      .json({ success: true, report, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    const report = await reportModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
