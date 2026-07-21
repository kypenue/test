import { PhotoModel } from "@/shared/types/models/Photo";

export const getFilelist = (url: string | PhotoModel) => {
    const base64Url = typeof url === 'string' && url.replace('data:application/octet-stream;base64', 'data:image/png;base64');

    return {
        url: typeof url === 'string' ? base64Url : url.url,
        uid: typeof url === 'string' ? Math.random().toString() : url.id,
        name: typeof url === 'string' ? 'url.png' : url.file_name,
    };
};