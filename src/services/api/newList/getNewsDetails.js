import http from "../../interceptor"; 

export const getBlogDetails = async (id) => {
    try {
        const result = await http.get(`/News/${id}`);
        return result;
      
    } catch (error) {   
        console.log(error);
        return error;

    }
    
};
