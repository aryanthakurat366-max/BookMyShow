const Show = require("../models/Show");
const sendResponse = require("../utilis/response");

const addShow = async (req, res) => {
  try {
    const { name, date, time, movie, theatre, ticketPrice, totalSeats } = req.body;

    if (!name || !date || !time || !movie || !theatre || !ticketPrice || !totalSeats) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const newShow = new Show({ name, date, time, movie, theatre, ticketPrice, totalSeats });
    await newShow.save();
    return sendResponse(res, 201, true, "Show added successfully", newShow);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to add show: ${error}`);
  }
};

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title poster genre duration")
      .populate("theatre", "name address");

    return sendResponse(res, 200, true, "Shows fetched successfully", shows);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch shows: ${error}`);
  }
};

const getShowById = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id)
      .populate("movie", "title poster genre duration")
      .populate("theatre", "name address");

    if (!show) {
      return sendResponse(res, 404, false, "Show not found");
    }

    return sendResponse(res, 200, true, "Show fetched successfully", show);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch show: ${error}`);
  }
};

const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({ movie: movieId })
      .populate("movie", "title poster")
      .populate("theatre", "name address status");

    // sirf approved theatres ke shows hi users ko dikhaye
    const approvedShows = shows.filter(show => show.theatre?.status === 'approved');

    return sendResponse(res, 200, true, "Shows fetched successfully", approvedShows);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch shows: ${error}`);
  }
};

const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedShow = await Show.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedShow) {
      return sendResponse(res, 404, false, "Show not found");
    }

    return sendResponse(res, 200, true, "Show updated successfully", updatedShow);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to update show: ${error}`);
  }
};

const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShow = await Show.findByIdAndDelete(id);

    if (!deletedShow) {
      return sendResponse(res, 404, false, "Show not found");
    }

    return sendResponse(res, 200, true, "Show deleted successfully");
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to delete show: ${error}`);
  }
};

module.exports = { addShow, getAllShows, getShowById, getShowsByMovie, updateShow, deleteShow };