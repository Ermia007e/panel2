
import http from "../../interceptor/index";

export const getListNewsCategory = async () => {
    try {
       
        const response = await http.get("/News/GetListNewsCategory")
        console.log(response)
        return response;
    } catch (error) {
        throw error
    }
}