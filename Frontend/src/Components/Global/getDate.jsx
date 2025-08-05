

export const updateDate = () => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear().toString().slice(-2);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const timestamp = `${day} ${month} ${year} ${hours}:${minutes}`;

    return timestamp


}

export const ConvetDate = (serial) => {
    const utcDays = (serial - 25569) * 86400; // 25569 is days from 1/1/1900 to 1/1/1970
    const date = new Date(utcDays * 1000);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + timezoneOffset);
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const year = adjustedDate.getFullYear();
    return `${year}-${month}-${day}`;
    
}