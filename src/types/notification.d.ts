export {};

declare global {
  interface INotification {
    _id: string;
    title: string;
    publishDate: string;
    sender: string;
    content: string;
  }

  interface INotifications {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: INotification[];
    };
  }
}
