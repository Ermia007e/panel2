import http from "../interceptor"; 

export const putAssistanceForCourse = async (courseId, userId, id) => {
    try {
      const response = await http.put('/CourseAssistance',
        {
            courseId: courseId,
            userId: userId,
            id: id
          }
      );
      return response
    } catch (error) {
      throw error;
    }
};
