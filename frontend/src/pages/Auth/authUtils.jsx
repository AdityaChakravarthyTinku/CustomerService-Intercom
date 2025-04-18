import api from "../../utils/axiosInstance";

export const submitForm = async (formData, isRegister) => {
  try {
    const endpoint = isRegister ? "/auth/register" : "/auth/login";
    const response = await api.post(endpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    throw error;
  }
};

