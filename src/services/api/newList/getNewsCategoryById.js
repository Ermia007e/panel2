import http from "../../interceptor"; 

export const NewsCategoryById = async (id) => {
    try {
      const response = await http.get(`/News/GetNewsCategory/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  };