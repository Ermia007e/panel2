import http from "../../interceptor";

export const loginStep = async (credentials) => {
  try {
    console.log("Fetching started...");
    console.log("API Request Data:", credentials);
    const result = await http.post(`/Sign/Login`, credentials);

    console.log("Login Response:", result); 
    return result;
  }catch (error) {
    throw error

  }
  
};
