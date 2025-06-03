import http from "../../interceptor/index"

export const fetchComments = async ({ queryKey }) => {
    const [, page] = queryKey
    const params = {
        pageNumber: page,
        rowsOfPage: 10,
    }
    const response = await http.get("/Course/CommentManagment", { params })
    return {
        users: response.data?.comments || [],
        total: response.data?.totalCount || 0,
    }
}

export const deleteComment = async (id) => {
    return http.delete(`/Course/DeleteCourseComment?CourseCommandId=${id}`)
}
export const acceptComment = async (id) => {
    return http.post(`/Course/AcceptCourseComment?CommentCourseId=${id}`)
}
export const rejectComment = async (id) => {
    return http.post(`/Course/RejectCourseComment?CommentCourseId=${id}`)
}