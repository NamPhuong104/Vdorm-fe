'use client';

import { faCalendar, faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Col, Flex, Row, Spin } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import dayjs from 'dayjs';
import Image from 'next/image';

interface IProps {
  data: INew;
}

const NewsDetails = (props: IProps) => {
  const { data } = props;

  const filterContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div className="client-news-details-container">
      {!data ? (
        <Spin style={{ backgroundColor: '#f5f5f5' }} />
      ) : (
        <>
          <div
            className="client-news-details-thumbnail"
            style={{ position: 'relative' }}
          >
            <Image
              alt={data.title}
              src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${data.thumbnail}`}
              fill={true}
              sizes="100vw"
            />
            <div
              className="thumbnail-container"
              style={{ position: 'absolute' }}
            >
              <Breadcrumb
                items={[
                  {
                    href: '/',
                    title: (
                      <>
                        <FontAwesomeIcon icon={faHouse} />
                        <span>Trang Chủ</span>
                      </>
                    ),
                  },
                  {
                    href: '/news',
                    title: (
                      <>
                        <FontAwesomeIcon icon={faNewspaper} />
                        <span>Tất Cả</span>
                      </>
                    ),
                  },
                ]}
              />
              <h1>{data.title}</h1>
            </div>
          </div>
          <div className="client-news-details-content">
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className="content">
                  <h2>{data.title}</h2>
                  <Flex>
                    <span className="publish-date">
                      <FontAwesomeIcon icon={faCalendar} />
                      {`${dayjs(data.publishDate).date()}, Tháng ${
                        dayjs(data.publishDate).month() + 1
                      }, ${dayjs(data.publishDate).year()}`}
                    </span>
                    <span className="category">{data.category}</span>
                  </Flex>
                  <span className="author">
                    <b>Tác giả:</b> {data.author}
                  </span>
                  <Paragraph>{filterContent(data.content)}</Paragraph>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsDetails;
