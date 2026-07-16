import axiosInstance from "./axionsInstance";

export async function createOrder(showId, seats) {
  try {
    const response = await axiosInstance.post("/bookings/create-order", { showId, seats });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function verifyPayment(paymentData) {
  try {
    const response = await axiosInstance.post("/bookings/verify", paymentData);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getMyBookings() {
  try {
    const response = await axiosInstance.get("/bookings/my-bookings");
    return response?.data;
  } catch (error) {
    return error;
  }
}