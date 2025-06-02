import http from "../../interceptor/index";

export const AddNews = async (formData) => {
    try {
        const response = await http.post("/News/CreateNews", formData);
        return response;
    } catch (error) {
        throw error;
    }
}