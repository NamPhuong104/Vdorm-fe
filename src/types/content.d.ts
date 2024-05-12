export {};

declare global {
  interface IContent {
    _id: string;
    category: string;
    subCategory: string;
    contentList: {}[];
  }

  interface IContents {
    statusCode?: number;
    message?: string;
    data: {
      metadata?: {
        current?: number;
        pageSize?: number;
        pages?: number;
        total?: number;
      };
      result: IContent[];
    };
  }

  interface IContentHomeAboutUs {
    _id: string;
    category: string;
    subCategory: string;
    contentList: {
      image: string;
      firstParagraph: string;
      secondParagraph: string;
    }[];
  }

  interface IContentHomeRoomType {
    _id: string;
    category: string;
    subCategory: string;
    contentList: {
      image: string;
      title: string;
      subTitle: string;
      description: string;
      route: string;
    }[];
  }

  interface IContentHomeServiceType {
    _id: string;
    category: string;
    subCategory: string;
    contentList: {
      title: string;
      description: string;
    }[];
  }

  interface IContentHomeCommonQuestion {
    _id: string;
    category: string;
    subCategory: string;
    contentList: {
      question: string;
      answer: string;
    }[];
  }
}
