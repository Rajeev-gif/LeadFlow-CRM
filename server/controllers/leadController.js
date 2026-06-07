const Lead = require("../models/Lead");

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and company are required",
      });
    }

    const existingLead = await Lead.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phone: phone.trim() }],
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "A lead with this email or phone already exists",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status: status || "New",
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

// @desc    Get all leads with search, filter, sort, pagination
// @route   GET /api/leads
// @access  Public
const getAllLeads = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = 10,
    } = req.query;

    const query = {};

    // Search by name, email, or company
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status.trim()) {
      query.status = status;
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(query).sort(sortOptions).skip(skip).limit(limitNumber).lean(),
      Lead.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: leads.length,
      totalLeads,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalLeads / limitNumber),
      data: leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Public
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Prevent duplicate email/phone if changed
    if (email || phone) {
      const duplicateConditions = [];
      if (email)
        duplicateConditions.push({ email: email.toLowerCase().trim() });
      if (phone) duplicateConditions.push({ phone: phone.trim() });

      if (duplicateConditions.length > 0) {
        const duplicate = await Lead.findOne({
          _id: { $ne: req.params.id },
          $or: duplicateConditions,
        });

        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: "Another lead already exists with this email or phone",
          });
        }
      }
    }

    lead.name = name ?? lead.name;
    lead.email = email ? email.toLocaleLowerCase().trim() : lead.email;
    lead.phone = phone ? phone.trim() : lead.phone;
    lead.company = company ?? lead.company;
    lead.status = status ?? lead.status;
    lead.notes = notes ?? lead.notes;

    const updatedLead = await lead.save();

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Public
const getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const statusStats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStatusStats = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };

    statusStats.forEach((item) => {
      formattedStatusStats[item._id] = item.count;
    });

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusStats: formattedStatusStats,
        recentLeads,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lead statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats,
};
