'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import { axiosAuth } from '@/util/axios';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Flex, Pagination, Row, Space, Spin } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterNews from './filter/FilterNews';

const News = () => {
  const router = useRouter();
  const search = useSearchParams();
  const searchTitle = search.get('title');
  const [isLoading, setIsLoading] = useState(false);
  const [newsList, setNewsList] = useState<INew[]>([]);
  const [latestNewsList, setLatestNewsList] = useState<INew[]>([]);
  const [title, setTitle] = useState<string>('');
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    if (searchTitle && searchTitle != '') {
      fetchNewsList(meta.current, meta.pageSize, searchTitle);
    } else {
      fetchNewsList(meta.current, meta.pageSize);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize]);

  useEffect(() => {
    fetchLatestNewsList();
  }, []);

  useEffect(() => {
    if (newsList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({
          ...prevMeta,
          current: prevMeta.current - 1,
        }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsList]);

  const fetchLatestNewsList = async () => {
    try {
      const res = await axiosAuth.get(
        `/news?current=1&pageSize=4&sort=-createdAt`,
      );
      setLatestNewsList(res?.data?.data?.result as INew[]);
    } catch (error) {
      setLatestNewsList([]);
    }
  };
  const fetchNewsList = async (
    current: number,
    pageSize: number,
    title?: string,
    category?: string,
  ) => {
    if (title && title != '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/news?current=${current}&pageSize=${pageSize}&sort=-createdAt&title=/${title}/i`,
        );
        setNewsList(res?.data?.data?.result as INew[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setTitle('');
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setNewsList([]);
      }
    } else if (category && category != '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/news?current=${current}&pageSize=${pageSize}&sort=-createdAt&category=${encodeURIComponent(
            category,
          )}`,
        );
        setNewsList(res?.data?.data?.result as INew[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setNewsList([]);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/news?current=${current}&pageSize=${pageSize}&sort=-createdAt`,
        );
        setNewsList(res?.data?.data?.result as INew[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setNewsList([]);
      }
    }
  };

  const filterContent = (content: string) => {
    const i = content.search('</p>');
    const result = content.slice(0, i + 4);
    return <div dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  return (
    <div className={`client-news-container ${sheliaFont.variable}`}>
      <div
        className="client-news-thumbnail"
        style={{
          backgroundImage: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/news-01.jpg)`,
        }}
      >
        <div className="client-news-thumbnail-title">Tin Tức</div>
      </div>
      <div className="client-news-content">
        <Row className="news-container">
          <Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={16}>
            {isLoading ? (
              <Spin style={{ backgroundColor: '#f5f5f5' }} />
            ) : (
              <Row>
                {newsList.map((item: INew) => (
                  <Col
                    key={item._id}
                    xs={24}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    xxl={12}
                  >
                    <Space className="card" title={item.title}>
                      <Link href={`news/${item._id}`}>
                        <div className="card-thumbnail">
                          <Image
                            alt={item.title}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${item.thumbnail}`}
                            width={0}
                            height={0}
                            sizes="(max-width: 788px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </Link>
                      <div className="card-content">
                        <Link href={`news/${item._id}`}>
                          <span className="title">{item.title}</span>
                        </Link>
                        <div>
                          <Flex justify="space-between">
                            <div>
                              <FontAwesomeIcon icon={faCalendar} />
                              <span className="publish-date">
                                {`${dayjs(item.publishDate).date()}, Tháng ${
                                  dayjs(item.publishDate).month() + 1
                                }, ${dayjs(item.publishDate).year()}`}
                              </span>
                            </div>
                            <span className="category">{item.category}</span>
                          </Flex>
                          <div className="content">
                            {filterContent(item.content)}
                          </div>
                          <Link href={`news/${item._id}`}>
                            <Button>Xem thêm</Button>
                          </Link>
                        </div>
                      </div>
                    </Space>
                  </Col>
                ))}
                <Col span={24}>
                  <div className="pagination">
                    <Pagination
                      current={meta.current}
                      pageSize={meta.pageSize}
                      total={meta.total}
                      onChange={(page: number, pageSize: number) => {
                        handleChangePage(page, pageSize);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            )}
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={8}
            xxl={7}
            className="filter-news"
          >
            <FilterNews
              latestNews={latestNewsList}
              fetchNewsList={(title, category) =>
                fetchNewsList(meta.current, meta.pageSize, title, category)
              }
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default News;
