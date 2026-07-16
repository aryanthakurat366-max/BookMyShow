import axiosInstance from "./axionsInstance";

export async function getTheatres() {
  try {
    const response = await axiosInstance.get("/theatres");
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function addTheatre(theatreData) {
  try {
    const response = await axiosInstance.post("/theatres", theatreData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function updateTheatre(id, theatreData) {
  try {
    const response = await axiosInstance.put(`/theatres/${id}`, theatreData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function deleteTheatre(id) {
  try {
    const response = await axiosInstance.delete(`/theatres/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function updateTheatreStatus(id, status) {
  try {
    const response = await axiosInstance.patch(`/theatres/${id}/status`, { status });
    return response?.data;
  } catch (error) {
    return error;
  }
}