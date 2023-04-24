import axiosInstance, { AxiosResponse } from 'axios';

type O = {
  baseURL: string;
};

export const axios = (options: O) => {
  return axiosInstance.create({
    baseURL: options.baseURL,
    withCredentials: true,
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
  });
};
