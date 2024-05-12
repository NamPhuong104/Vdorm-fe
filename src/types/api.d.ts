import { AxiosHeaders } from 'axios';

export {};

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IResponse<T> {
    error?: string | string[];
    statusCode: number | string;
    message: string;
    data?: {
      result?: T;
    };
  }

  interface IResponseAuthentication<T> {
    error?: string | string[];
    statusCode: number | string;
    message: string;
    data?: T;
  }

  interface IResponsePaginate<T> {
    error?: string | string[];
    statusCode: number | string;
    message: string;
    data?: T;
  }

  interface IPaginate<T> {
    meta: IMeta;
    result: T[];
  }

  interface IMeta {
    current: number;
    pageSize: number;
    pages: number | undefined;
    total: number | undefined;
  }

  interface IAxios<T> {
    config?: {};
    headers?: AxiosHeaders;
    request?: XMLHttpRequest;
    status?: number;
    statusText?: string;
    data?: T;
  }
}
