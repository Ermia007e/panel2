import { formDataModifire } from "./formDateModifier";
import http from "../../interceptor"; 

export const ActiveDeactiveNews = async (isActive, id) => {
    try {
        const formData = formDataModifire({Active: isActive, Id: id})
        const result = await http.put('/News/ActiveDeactiveNews', formData);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};
