'use client';

import {
  faChevronRight,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Flex, Input } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface IProps {
  detail?: boolean;
  latestNews: INew[];
  fetchNewsList: (title: string, category?: string) => void;
}

const FilterNews = (props: IProps) => {
  const [title, setTitle] = useState<string>('');
  const { detail, latestNews, fetchNewsList } = props;

  return (
    <>
      <div className="search-news-container">
        <Input
          allowClear
          placeholder="Tìm kiếm tin tức"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Button
          icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          onClick={() => fetchNewsList(title)}
        />
      </div>
      <div className="news-category-container">
        <h3 className="title">Danh Mục</h3>
        <ul>
          <Flex
            align="center"
            onClick={() => {
              fetchNewsList('', '');
            }}
          >
            <FontAwesomeIcon size="xs" icon={faChevronRight} />
            <li>TẤT CẢ</li>
          </Flex>
          <Flex
            align="center"
            onClick={() => {
              fetchNewsList('', 'NGHIÊN CỨU & SÁNG TẠO');
            }}
          >
            <FontAwesomeIcon size="xs" icon={faChevronRight} />
            <li>NGHIÊN CỨU & SÁNG TẠO</li>
          </Flex>
          <Flex
            align="center"
            onClick={() => {
              fetchNewsList('', 'HỢP TÁC QUỐC TẾ');
            }}
          >
            <FontAwesomeIcon size="xs" icon={faChevronRight} />
            <li>HỢP TÁC QUỐC TẾ</li>
          </Flex>
          <Flex
            align="center"
            onClick={() => {
              fetchNewsList('', 'TUYỂN SINH');
            }}
          >
            <FontAwesomeIcon size="xs" icon={faChevronRight} />
            <li>TUYỂN SINH</li>
          </Flex>
          <Flex
            align="center"
            onClick={() => {
              fetchNewsList('', 'ĐỜI SỐNG VĂN LANG');
            }}
          >
            <FontAwesomeIcon size="xs" icon={faChevronRight} />
            <li>ĐỜI SỐNG VĂN LANG</li>
          </Flex>
          <Flex
            align="center"
            onClick={() => {
              fetchNewsList('', 'HOẠT ĐỘNG CỦA VĂN LANG');
            }}
          >
            <FontAwesomeIcon size="xs" icon={faChevronRight} />
            <li>HOẠT ĐỘNG CỦA VĂN LANG</li>
          </Flex>
        </ul>
      </div>
      <div className="latest-news-container">
        <h3 className="title">Bài viết mới nhất</h3>
        {latestNews.map((item: INew) => {
          return (
            <div key={item._id} className="card">
              <div style={{ position: 'relative' }} className="card-thumbnail">
                <Link href={!detail ? `/news/${item._id}` : `${item._id}`}>
                  <Image
                    alt={item.title}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${item.thumbnail}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 788px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Link>
              </div>
              <div className="card-content">
                <Link href={!detail ? `/news/${item._id}` : `${item._id}`}>
                  <h4 className="title">{item.title}</h4>
                </Link>
                <p className="publish-date">
                  {`${dayjs(item.publishDate).date()}, Tháng ${
                    dayjs(item.publishDate).month() + 1
                  }, ${dayjs(item.publishDate).year()}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FilterNews;
