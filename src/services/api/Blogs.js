import http from "../interceptor";

export const getBlogs = async () => {
  try {
    const response = await http.get(
      "/News/AdminNewsFilterList?PageNumber=1&RowsOfPage=10&SortingCol=InsertDate&SortType=DESC&Query=&IsActive=true"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const isActiveBlogs = async (active) => {
  try {
      const response = await http.put("/News/ActiveDeactiveNews", active)
      console.log('active', active);
      return response
  } catch (error) {
      throw error
  }
}

export const getCategoryList = async () => {
  try {
    const response = await http.get(
      "/News/GetListNewsCategory"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getgroupList = async (PageNumber) => {
  try {
    const response = await http.get(
      `/CourseGroup?PageNumber=${PageNumber}&RowsOfPage=10&SortingCol=DESC&SortType=Expire&Query=`
    );
    return response;
  } catch (error) {
    throw error;
  }
};