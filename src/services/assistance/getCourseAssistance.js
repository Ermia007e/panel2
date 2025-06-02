import http from "../interceptor"; 

export const getCourseAssistance = async () => {
    try {
      const response = await http.get('/CourseAssistance');
      return response
    } catch (error) {
      throw error;
    }
};

export const getCourseAssistanceById = async (id) => {
  try {
    const response = await http.get(`/CourseAssistance/${id}`);
    return response
  } catch (error) {
    throw error;
  }
};