import http from "../interceptor";


export const GetProfileInfo = async () => {
    try {
    
      const response = await http.get(`/SharePanel/GetProfileInfo`);
      console.log(response , "response")
      return response;
    } catch (error) {
      throw error;
    }
  };