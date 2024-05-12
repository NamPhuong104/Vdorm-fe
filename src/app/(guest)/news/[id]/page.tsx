import NewsDetails from '@/components/client/news/details/NewsDetails';
import { sendRequest } from '@/util/api';
import React from 'react';

const NewsDetailPage = async ({ params }: { params: { id: string } }) => {
  const data = await sendRequest<IResponseAuthentication<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/news/${params.id}`,
    method: 'GET',
  });
  return <NewsDetails data={data.data ?? {}} />;
};

export default NewsDetailPage;
