import { formDataModifire } from "./formDateModifier";
import http from "../../interceptor"; 

export const createNews = async (formData) => {
    try {
        const formDatas = formDataModifire(formData)
        const result = await http.post('/News/CreateNews', {data:formDatas});
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};
