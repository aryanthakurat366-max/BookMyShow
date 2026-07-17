const Movie = require("../models/Movie.js");
const sendResponse = require("../utilis/response");

const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    return sendResponse(res, 201, true, "Movie added successfully", newMovie);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to add movie: ${error}`);
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return sendResponse(res, 200, true, "Movies fetched successfully", movies);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch movies: ${error}`);
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return sendResponse(res, 404, false, "Movie not found");
    }

    return sendResponse(res, 200, true, "Movie fetched successfully", movie);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch movie: ${error}`);
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedMovie) {
      return sendResponse(res, 404, false, "Movie not found");
    }

    return sendResponse(res, 200, true, "Movie updated successfully", updatedMovie);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to update movie: ${error}`);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return sendResponse(res, 404, false, "Movie not found");
    }

    return sendResponse(res, 200, true, "Movie deleted successfully");
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to delete movie: ${error}`);
  }
};

module.exports = { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie };