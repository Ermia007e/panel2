import { formDataModifire } from "./formDateModifier";
import http from "../../interceptor"; 

export const putUpdateNews = async (formData) => {
    const formDatas = formDataModifire(formData)
    try {
        const result = await http.put('/News/UpdateNews', formDatas);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};