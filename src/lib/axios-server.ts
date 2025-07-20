import axios, { AxiosRequestConfig } from "axios";

const getAxiosServerInstance = async () => {
    // Dynamically import headers only when needed in server context
    const { headers } = await import('next/headers');
    
    // Get all headers from the incoming request
    const requestHeaders = await headers();
    const headerObj: Record<string, string> = {};
    
    // Copy all headers from the request
    requestHeaders.forEach((value, key) => {
        // Avoid setting certain headers that axios will set automatically
        if (!['content-length', 'host'].includes(key.toLowerCase())) {
            headerObj[key] = value;
        }
    });
    
    // Extract host and protocol from headers
    const host = requestHeaders.get('host') || 'localhost:3000';
    const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
    
    // Construct the base URL from the request's origin
    const apiBaseUrl = `${protocol}://${host}`;
    
    return axios.create({
        baseURL: apiBaseUrl,
        withCredentials: true,
        headers: headerObj
    });
};

const axiosServer = {
    get: async (url: string, config?: AxiosRequestConfig) => {
        const instance = await getAxiosServerInstance();
        return instance.get(url, config);
    },
    post: async (url: string, data?: any, config?: AxiosRequestConfig) => {
        const instance = await getAxiosServerInstance();
        return instance.post(url, data, config);
    },
    put: async (url: string, data?: any, config?: AxiosRequestConfig) => {
        const instance = await getAxiosServerInstance();
        return instance.put(url, data, config);
    },
    delete: async (url: string, config?: AxiosRequestConfig) => {
        const instance = await getAxiosServerInstance();
        return instance.delete(url, config);
    }
};

export default axiosServer;
