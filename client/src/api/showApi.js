import axiosInstance from "./axionsInstance";

export async function getAllShows() {
  try {
    const response = await axiosInstance.get("/shows");
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getShowById(id) {
  try {
    const response = await axiosInstance.get(`/shows/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getShowsByMovie(movieId) {
  try {
    const response = await axiosInstance.get(`/shows/movie/${movieId}`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function addShow(showData) {
  try {
    const response = await axiosInstance.post("/shows", showData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function updateShow(id, showData) {
  try {
    const response = await axiosInstance.put(`/shows/${id}`, showData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function deleteShow(id) {
  try {
    const response = await axiosInstance.delete(`/shows/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
}