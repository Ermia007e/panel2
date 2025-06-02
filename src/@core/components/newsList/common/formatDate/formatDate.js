export const formatDate = (dateString) => {
    if (!dateString) return "تاریخ مشخص نشده";
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
};