import http from "../../interceptor";

export const Creategroup = async (Body) => {
    try {
        const result = await http.post(`/CourseGroup`,Body);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const CreateSocialGroupgroup = async (obj) => {
    try {
        const result = await http.post(`/CourseSocialGroup`,obj);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};