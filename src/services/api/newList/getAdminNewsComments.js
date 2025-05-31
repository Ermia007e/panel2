import http from "../../interceptor"; 

export const getAdminNewsComments = async (detailId) => {
    try {
        const result = await http.get(`/News/GetAdminNewsComments?NewsId=${detailId}`);
        return result;
      
    } catch (error) {   
        console.log(error);
        return error;

    }
    
};
