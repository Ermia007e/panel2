import http from "../interceptor"; 

export const assistanceWork = async () => {
    try {
      const response = await http.get('/AssistanceWork');
      return response
    } catch (error) {
      throw error;
    }
};

export const assistanceWorkById = async (workId ) => {
  try {
    const response = await http.get(`/AssistanceWork/${workId }`);
    return response
  } catch (error) {
    throw error;
  }
};