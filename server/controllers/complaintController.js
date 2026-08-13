const Complaint = require("../models/Complaint");

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    // 🔍 DEBUG: Log everything
    console.log("========================================");
    console.log("📝 CREATE COMPLAINT DEBUG");
    console.log("========================================");
    console.log("📦 Request Body:", req.body);
    console.log("👤 User Object:", req.user);
    console.log("🆔 User ID:", req.user?._id);
    console.log("📧 User Email:", req.user?.email);
    console.log("========================================");

    const { title, description, category } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please fill all fields: title, description, category",
        received: { title, description, category },
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log("❌ Authentication failed: No user found");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("✅ Creating complaint for user:", req.user._id);

    // Create complaint
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      category,
      description,
      status: "Pending",
    });

    console.log("✅ Complaint created successfully:", complaint._id);
    console.log("========================================\n");

    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("❌ Create Complaint Error:", error);
    console.error("❌ Error Stack:", error.stack);
    console.log("========================================\n");
    
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Get logged-in user's complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get My Complaints Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get recent complaints for admin dashboard
// @route   GET /api/complaints/recent
// @access  Private/Admin
const getRecentComplaints = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get Recent Complaints Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all complaints for admin
// @route   GET /api/complaints/all
// @access  Private/Admin
const getAllComplaintsForAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get All Complaints For Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update complaint (user owns it)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, status } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user owns the complaint
    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this complaint",
      });
    }

    complaint.title = title || complaint.title;
    complaint.category = category || complaint.category;
    complaint.description = description || complaint.description;
    complaint.status = status || complaint.status;

    await complaint.save();

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete complaint (user owns it)
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user owns the complaint
    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this complaint",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete Complaint Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
  getRecentComplaints,
  getAllComplaintsForAdmin,
};