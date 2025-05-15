import http from "../../interceptor/index";

export const getUserInfo = async () => {
    try {
       
        const response = await http.get("/SharePanel/GetProfileInfo")
        console.log(response)
        return response;
    } catch (error) {
        throw error
    }
}