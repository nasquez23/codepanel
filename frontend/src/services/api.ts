import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { APIURL } from "../config";

const generateAuthHeaders = (idToken: string | null | undefined) => ({
  ...(idToken && {
    Authorization: `Bearer ${idToken}`,
    authorization: `Bearer ${idToken}`,
  }),
});

const generateRequestConfig = ({
  headers,
  accessToken,
  ...base
}: AxiosRequestConfig & { accessToken?: string } = {}) => {
  return {
    ...(base || {}),
    baseURL: APIURL,
    withCredentials: true,
    headers: {
      ...(headers || {}),
      ...(accessToken && generateAuthHeaders(accessToken)),
    },
  };
};

export const axiosInstance = axios.create({
  baseURL: APIURL,
  withCredentials: true,
});

export const fetcher = async <T>(
  path: string,
  config?: AxiosRequestConfig & { accessToken?: string }
) => {
  const { data } = await axiosInstance.get<T>(
    path,
    generateRequestConfig(config)
  );

  return data;
};

export const poster = async <D = any, R = any>(
  path: string,
  data?: D,
  config?: AxiosRequestConfig<D> & { accessToken?: string }
): Promise<AxiosResponse<R>> => {
  return await axiosInstance.post<R, AxiosResponse<R>, D>(
    path,
    data,
    generateRequestConfig(config)
  );
};

export const patcher = async <D = any, R = any>(
  path: string,
  data?: D,
  config?: AxiosRequestConfig<D> & { accessToken?: string }
): Promise<AxiosResponse<R>> => {
  return await axiosInstance.patch(path, data, generateRequestConfig(config));
};

export const deleter = async <D = any, R = any>(
  path: string,
  config?: AxiosRequestConfig<D> & { accessToken?: string }
): Promise<AxiosResponse<R>> => {
  return await axiosInstance.delete(path, generateRequestConfig(config));
};
