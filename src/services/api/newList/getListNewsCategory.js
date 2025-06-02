import http from "../../interceptor"; 

export const getListNewsCategory = async () => {
    try {
      const response = await http.get('/News/GetListNewsCategory');
      return response
    } catch (error) {
      console.error('Error fetching news categories:', error);
      throw error;
    }
};