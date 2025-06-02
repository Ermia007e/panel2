import http from "../interceptor"; 

export const getAllCourseByPagination = async () => {
    try {
        const result = await http.get(`/Home/GetCoursesWithPagination?PageNumber=1&RowsOfPage=10&SortingCol=Active&SortType=DESC&TechCount=0&`);
        return result;
      
    } catch (error) {   
        console.log(error);
        return error;
        
    }
    
};
