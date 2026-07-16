import axiosInstance from "./axionsInstance";

export async function getAllMovies() {
  try {
    const response = await axiosInstance.get("/movies");
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getMovieById(id) {
  try {
    const response = await axiosInstance.get(`/movies/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function addMovie(movieData) {
  try {
    const response = await axiosInstance.post("/movies", movieData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function updateMovie(id, movieData) {
  try {
    const response = await axiosInstance.put(`/movies/${id}`, movieData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function deleteMovie(id) {
  try {
    const response = await axiosInstance.delete(`/movies/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
}