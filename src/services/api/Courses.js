import http from "../interceptor";

export const getCourses = async (PageNumber,SortingCol,SortingType) => {
  try {
    const response = await http.get(
      `/Course/CourseList?PageNumber=${PageNumber}&RowsOfPage=10${SortingCol ? `&SortingCol=${SortingCol}` :""}${SortingType ? `&SortType=${SortingType}` :""}&Query`
    );
    console.log(response , "response")

    return response;
  } catch (error) {
    throw error;
  }
};

export const getMyCourses = async () => {
  try {
    const response = await http.get(
      "/Course/TeacherCourseList?PageNumber=1&RowsOfPage=10&SortingCol=DESC&SortType"
    );
    return response;
  } catch (error) {
    throw error;
  }
};



export const getReservedCourses = async () => {
  try {
    const response = await http.get("/SharePanel/GetMyCoursesReserve");
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};


export const deleteCourse= async (RemoveCourse) => {
  try {
      const result = await http.delete("/Course/DeleteCourse",{data: RemoveCourse});
      console.log(result);
      return result
      
  } catch (error) {
      throw error;
  }
}


export const expireCourses = async (expire) => {
  try {
      const response = await http.put("/Course/SetExpireCourse", expire)
      console.log('response', expire);
      return response
  } catch (error) {
      throw error
  }
}

export const isActiveCourses = async (active) => {
  try {
      const response = await http.put("/Course/ActiveAndDeactiveCourse", active)
      console.log('active', active);
      return response
  } catch (error) {
      throw error
  }
}


export const getCourseDetails = async (courseId) => {
  try {
    const response = await http.get(`/Course/${courseId}`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCourseUsers = async (courseId) => {
  try {
    console.log(courseId, "response")
    const response = await http.get(`/CourseUser/GetCourseUserList?CourseId=${courseId}&PageNumber=1&RowsOfPage=1`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};



export const getUserReserve = async (courseId) => {
  try {
    console.log(courseId, "response")
    const response = await http.get(`/CourseReserve/${courseId}`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};



export const getUserComments = async (courseId) => {
  try {
    console.log(courseId, "response")
    const response = await http.get(`/Course/GetCourseCommnets/${courseId}`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteComments = async (id) => {
  try {
  
    const response = await http.delete(`/Course/DeleteCourseComment?CourseCommandId=${id}`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};

//CourseGroup

export const getCourseGroup = async (courseId) => {
  try {
    console.log(courseId, "response")
    const response = await http.get(`/CourseGroup/GetCourseGroup?TeacherId=20205&CourseId=e6a4b34e-c88f-ef11-b6e6-82fc07f68400`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSocialGroup = async () => {
  try {
    const response = await http.get(`/CourseSocialGroup`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};

export const CourseGroup = async (courseId,teacherId) => {
  try {
  
    const response = await http.delete(`/CourseGroup/GetCourseGroup?TeacherId=${teacherId}&CourseId=${courseId}`);
    console.log(response , "response")
    return response;
  } catch (error) {
    throw error;
  }
};


//Schedual

export const GetAdminScheduals = async (startDate,endDate) => {
  try {
    const response = await http.get(`/Schedual/GetAdminScheduals`)
    return response;
  } catch (error) {
    throw error;
  }
};

export const isLockToRiase = async (active) => {
  try {
      const response = await http.put("/Schedual/LockToRiase", active)
      console.log('active', active);
      return response
  } catch (error) {
      throw error
  }
}

export const isSchedualFroming = async (active) => {
  try {
      const response = await http.put("/Schedual/SchedualFroming", active)
      console.log('active', active);
      return response
  } catch (error) {
      throw error
  }
}