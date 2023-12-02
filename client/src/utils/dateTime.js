export const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeStart = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return timeStart
}

export const getFormattedDate = (d) => {
    const date = new Date(d)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
//    const hours = (date.getHours() - 7).toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeStart = `${year}-${month}-${day} 00:00:00`;
    // const timeStart = null;

    return timeStart
}