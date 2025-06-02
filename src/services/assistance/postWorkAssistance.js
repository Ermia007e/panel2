import http from "../interceptor"; 

export const potAssistanceWork = async (data) => {
  try {
    const response = await http.post('/AssistanceWork', {
      worktitle: data.worktitle,
      workDescribe: data.workDescribe,
      assistanceId: data.assistanceId,
      workDate: data.workDate
    });
    return response;
  } catch (error) {
    throw error;
  }
};