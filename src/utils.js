export const getBody = (data) => {
    return typeof data.body === 'string' ? JSON.parse(data.body) : data.body || data;
}