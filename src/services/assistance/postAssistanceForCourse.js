import http from "../interceptor"; 

export const postAssistanceForCourse = async (courseId, userId) => {
    try {
      const response = await http.post('/CourseAssistance',
        {
            courseId: courseId,
            userId: userId,
          }
      );
      return response
    } catch (error) {
      throw error;
    }
};
