import http from "../../interceptor";

export const AddSchedual = async (data,courseId) => {
    const params = {currentCurseId : courseId}
    try {
        const result = await http.post('/Schedual/AddSchedualSingle',data,{params});
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};