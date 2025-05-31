import http from "../interceptor"; 

export const putAssistanceWork = async (formData) => {
  console.log("Request payload:", {
    worktitle: formData.worktitle,
    workDescribe: formData.workDescribe,
    assistanceId: formData.assistanceId,
    workDate: formData.workDate,
    id: formData.id
  });
  try {
    const response = await http.put('/AssistanceWork', {
      worktitle: formData.worktitle,
      workDescribe: formData.workDescribe,
      assistanceId: formData.assistanceId ,
      workDate: formData.workDate,
      id: formData.id
    });
    return response;
  } catch (error) {
    throw error;
  }
};