import http from "../../interceptor"; //axios//

export const getAdminNewsFilterList = async ({
    PageNumber = 1,
    RowsOfPage = 10,
    SortingCol = "InsertDate",
    SortType = "DESC",
    Query = "",
    IsActive = true
  }) => {
    const params = {
      PageNumber,
      RowsOfPage,
      SortingCol,
      SortType,
      Query,
      IsActive 
    };
    
    try {
      const result = await http.get(`/News/AdminNewsFilterList`, { 
        params,
        paramsSerializer: {
          indexes: null 
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
};