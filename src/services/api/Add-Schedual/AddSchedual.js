import http from "../../interceptor";

export const AddSchedual = async (data) => {
    try {
        const result = await http.post('/Schedual/AddSchedualSingle',data);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};