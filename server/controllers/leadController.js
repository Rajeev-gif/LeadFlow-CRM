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
  } catch (error) {}
};
