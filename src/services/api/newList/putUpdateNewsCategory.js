import { formDataModifire } from "./formDateModifier";
import http from "../../interceptor"; 

export const UpdateNewsCategory = async ( id,image,categoryName,iconName,iconAddress,googleDescribe,googleTitle) => {
    try {
        const formData = formDataModifire({ Id: id, Image:image, CategoryName:categoryName, IconAddress:iconAddress, 
            IconName:iconName ,GoogleTitle:googleTitle, GoogleDescribe:googleDescribe})
        const result = await http.put('/News/UpdateNewsCategory', formData);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};