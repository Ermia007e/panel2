import { formDataModifire } from "./formDateModifier";
import http from "../../interceptor"; 

export const CreateNewsCategory = async (categoryName, image, iconAddress, iconName, googleTitle, googleDescribe) => {
    try {
        const formData = formDataModifire({CategoryName: categoryName, Image: image	, IconAddress: iconAddress, IconName: iconName,
            GoogleTitle: googleTitle, GoogleDescribe: googleDescribe})
             
        const result = await http.post('/News/CreateNewsCategory',formData);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}; 