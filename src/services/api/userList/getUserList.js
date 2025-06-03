import http from "../../interceptor/index"

export const getUserList = async (pageNumber) => {
    const params = {
        PageNumber: pageNumber,
        RowsOFPage: 10,
    };

    try {
        const response = await http.get("/User/UserMannage", { params });
        console.log("API RESPONSE:", response);
        const listUser = response.data?.listUser || [];
        const totalCount = response.data?.totalCount || 0;

        console.log("لیست کاربران:", listUser);
        console.log("تعداد کل:", totalCount);

        if (Array.isArray(listUser)) {
            return { users: listUser, total: totalCount };
        } else {
            console.error("داده‌های نامعتبر:", response);
            return { users: [], total: 0 };
        }
    } catch (error) {
        console.error("خطا در دریافت لیست کاربران:", error);
        return { users: [], total: 0 };
    }
};