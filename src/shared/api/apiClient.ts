import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL.');
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const apiClientRequest = <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return apiClient.request<T>(config);
};

export default apiClient;
