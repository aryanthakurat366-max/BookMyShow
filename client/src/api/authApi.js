import axiosInstance from "./axionsInstance";

export async function registerUser(userData) {
  try {
    const response = await axiosInstance.post("/users/register", userData);
    console.log(response);
    if (response.status === 201) {
      return response?.data;
    } else if (response.status === 400) {
      throw new Error(response?.data);
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function loginUser(userData) {
  try {
    const response = await axiosInstance.post("/users/login", userData);
    console.log(response);
    if (response.status === 200) {
      return response?.data;
    } else if (response.status === 400) {
      throw new Error(response?.data);
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await axiosInstance.get(`/users/currentUser`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axiosInstance.post("/users/forgot-password", { email });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function resetPassword(token, password) {
  try {
    const response = await axiosInstance.post(`/users/reset-password/${token}`, { password });
    return response?.data;
  } catch (error) {
    return error;
  }
}