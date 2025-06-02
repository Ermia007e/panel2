import http from "../../interceptor"; 

export const createNewsReplyComment = async (detailId, userIpAddress, title, describe, userId, parentId) => {
    try {
        const result = await http.post(`/News/CreateNewsReplyComment`,
            {newsId : detailId, userIpAddress: userIpAddress, title:title ,describe:describe ,userId:userId, parentId: parentId} );
             console.log(newsId,'newsId')
        return result;

    } catch (error) {
        console.log(error, 'createNewsReplyComment');
        return error;

    }
};