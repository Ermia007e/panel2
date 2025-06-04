import http from "../../interceptor/index"

export const getTeacherList = async (pageNumber) => {
    const params = {
        PageNumber: pageNumber,
        RowsOFPage: 10,
        isActiveUser: true,
    };

    try {
        const response = await http.get("/Home/GetTeachers", { params });
        const listUser = Array.isArray(response.data) ? response.data : (response.data?.listUser || []);
        const totalCount = Array.isArray(response.data) ? response.data.length : (response.data?.totalCount || 0);

        return { users: listUser, total: totalCount };
    } catch (error) {
        console.error("خطا در دریافت لیست کاربران:", error);
        return { users: [], total: 0 };
    }
};