import http from "../../interceptor/index";

export const GetDepartment = async (page = 1, pageSize = 10) => {
    try {
        const response = await http.get(`/Department?page=${page}&pageSize=${pageSize}`);
        console.log("GetDepartment Response:", response);
        return response;
    } catch (error) {
        console.error("Error in GetDepartment:", error);
        throw error;
    }
};
export const AddDepartment = async (departmentData) => {
    try {
        const response = await http.post("/Department", departmentData);
        console.log("AddDepartment Response:", response);
        return response;
    } catch (error) {
        console.error("Error in AddDepartment:", error);
        throw error;
    }
};

export const EditDepartment = async (departmentId, departmentData) => {
    try {
        const response = await http.put(`/Department/${departmentId}`, departmentData);
        console.log("EditDepartment Response:", response);
        return response;
    } catch (error) {
        console.error("Error in EditDepartment:", error);
        throw error;
    }
};