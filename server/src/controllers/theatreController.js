const Theatre = require("../models/Theatre");
const sendResponse = require("../utilis/response");

const addTheatre = async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;

    if (!name || !address || !phone || !email) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const newTheatre = new Theatre({
      name,
      address,
      phone,
      email,
      owner: req.user?.id,
    });

    await newTheatre.save();
    return sendResponse(res, 201, true, "Theatre added successfully", newTheatre);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to add theatre: ${error}`);
  }
};

const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate("owner", "name email role");
    return sendResponse(res, 200, true, "Theatres fetched successfully", theatres);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch theatres: ${error}`);
  }
};

const updateTheatres = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTheatre = await Theatre.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTheatre) {
      return sendResponse(res, 404, false, "Theatre not found");
    }

    return sendResponse(res, 200, true, "Theatre updated successfully", updatedTheatre);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to update theatre: ${error}`);
  }
};

const deleteTheatres = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheatre = await Theatre.findByIdAndDelete(id);

    if (!deletedTheatre) {
      return sendResponse(res, 404, false, "Theatre not found");
    }

    return sendResponse(res, 200, true, "Theatre deleted successfully");
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to delete theatre: ${error}`);
  }
};

const updateTheatreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return sendResponse(res, 400, false, "Status must be 'approved' or 'rejected'");
    }

    const updatedTheatre = await Theatre.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("owner", "name email role");

    if (!updatedTheatre) {
      return sendResponse(res, 404, false, "Theatre not found");
    }

    return sendResponse(res, 200, true, `Theatre ${status} successfully`, updatedTheatre);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to update status: ${error}`);
  }
};

module.exports = { addTheatre, getTheatres, updateTheatres, deleteTheatres, updateTheatreStatus };