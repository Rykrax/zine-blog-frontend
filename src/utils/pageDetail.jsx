const getRelativeTime = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    return `${Math.floor(months / 12)} năm trước`;
};

const getReadingTime = (content) => {
    if (!content) return "1 phút đọc";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} phút đọc`;
};

export const displayPage = {
    getRelativeTime,
    getReadingTime
}