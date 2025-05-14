import http from "../../interceptor/index";

export const getUserList = async (pageNumber) => {
    const params = {
        PageNumber: pageNumber,
        RowsOFPage: 10,
        isActiveUser: true,
    };

    try {
        const response = await http.get("/User/UserMannage", { params });

        console.log("API Response:", response); // بررسی مقدار دریافت‌شده
        
        // بررسی اینکه داده‌ها آرایه هستند
        if (!Array.isArray(response.data?.users)) {
            console.error("داده‌های نامعتبر:", response);
            return [];
        }

        return response.data.users;
    } catch (error) {
        console.error("خطا در دریافت لیست کاربران:", error);
        return [];
    }
};