import axios from "axios";
import http from "../../interceptor/index";

const fetchUsers = async () => {
  try {
    const response = await http.get("/Report/DashboardReport");
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

export default fetchUsers;