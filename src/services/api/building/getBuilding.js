

import http from "../../interceptor/index"; 

export const getBuilding = async ({ page = 1, searchTerm = '', pageSize = 10 }) => {
    const queryParams = new URLSearchParams({ page, pageSize });
    if (searchTerm) queryParams.append('searchTerm', searchTerm);
    const response = await http.get(`/Building?${queryParams.toString()}`);
    return response;
};
export const activateBuilding = async (id) => {
    const response = await http.put(`/Building/Active/${id}`);
    return response;
};

export const deactivateBuilding = async (id) => {
    const response = await http.put(`/Building/Deactive/${id}`);
    return response;
};

export const addBuilding = async (newBuildingData) => {
    const response = await http.post("/Building", newBuildingData);
    return response;
};
export const updateBuilding = async (id, updatedData) => {
    const response = await http.put(`/Building/${id}`, updatedData);
    return response;
};