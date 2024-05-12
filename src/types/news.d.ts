export {};

declare global {
  interface INew {
    _id: string;
    title: string;
    publishDate: string;
    thumbnail: string;
    category: string;
    author: string;
    content: string;
  }

  interface INews {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: INew[];
    };
  }
}
