import http from "../../interceptor";


export const getCreateCourse = async () => {
    try {
        const result = await http.get(`/Course/GetCreate`);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const CreateCourse = async (data) => {
    console.log(data , "data")
    try {
        const result = await http.post(`/Course`, data);
        return result;
    }
    
    catch (error) {
        console.log(error);
        return error;
    }

};

export const CreateCourseStep3 = async (data) => {
    console.log(data , "data")
    try {
        const result = await http.post(`/Course/AddCourseTechnology?courseId=<uuid>`, data);
        return result;
    }
    
    catch (error) {
        console.log(error);
        return error;
    }

};

export const UpdateCourse = async (data) => {
    console.log(data , "data")

    try {
        const result = await http.put(`/Course`,data);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};