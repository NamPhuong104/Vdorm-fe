'use client';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Flex, Row } from 'antd';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import DetailsButton from '../../global/DetailsButton';

interface IProps {
  newsList: INew[] | [];
}

const Section4 = (props: IProps) => {
  const { newsList } = props;

  return (
    <section className="section-4">
      <div className="news-container">
        <Flex className="news-title" align="center" justify="space-between">
          <Title level={2}>Tin Tức</Title>
          <Button className="details-btn">
            <Link
              href="/news"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Title level={5}>Xem tất cả</Title>
              <div className="see-more-icon">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </Link>
          </Button>
        </Flex>
        <Row gutter={[30, 10]} className="news-content-1">
          <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
            <div className="col-news-1">
              <div className="image-wrapper">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[0].thumbnail}`}
                  alt="news"
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <Text>{newsList[0].category}</Text>
                <Link href={`news/${newsList[0]._id}`}>
                  <Title level={3}>{newsList[0].title}</Title>
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
            <Row className="col-news-2">
              <Col span={24}>
                <Flex>
                  <div className="image-wrapper">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[1].thumbnail}`}
                      alt="news"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </div>
                  <Flex>
                    <Text>{newsList[1].category}</Text>
                    <Link href={`news/${newsList[1]._id}`}>
                      <Title level={3}>{newsList[1].title}</Title>
                    </Link>
                  </Flex>
                </Flex>
              </Col>
              <Col span={24}>
                <Flex>
                  <div className="image-wrapper">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[2].thumbnail}`}
                      alt="news"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </div>
                  <Flex>
                    <Text>{newsList[2].category}</Text>
                    <Link href={`news/${newsList[2]._id}`}>
                      <Title level={3}>{newsList[2].title}</Title>
                    </Link>
                  </Flex>
                </Flex>
              </Col>
              <Col span={24}>
                <Flex>
                  <div className="image-wrapper">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[3].thumbnail}`}
                      alt="news"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </div>
                  <Flex>
                    <Text>{newsList[3].category}</Text>
                    <Link href={`news/${newsList[3]._id}`}>
                      <Title level={3}>{newsList[3].title}</Title>
                    </Link>
                  </Flex>
                </Flex>
              </Col>
              <Col span={24}>
                <Flex>
                  <div className="image-wrapper">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[4].thumbnail}`}
                      alt="news"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </div>
                  <Flex>
                    <Text>{newsList[4].category}</Text>
                    <Link href={`news/${newsList[4]._id}`}>
                      <Title level={3}>{newsList[4].title}</Title>
                    </Link>
                  </Flex>
                </Flex>
              </Col>
              <Col span={24}>
                <Flex>
                  <div className="image-wrapper">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[5].thumbnail}`}
                      alt="news"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </div>
                  <Flex>
                    <Text>{newsList[5].category}</Text>
                    <Link href={`news/${newsList[5]._id}`}>
                      <Title level={3}>{newsList[5].title}</Title>
                    </Link>
                  </Flex>
                </Flex>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="news-content-2">
          <Flex>
            <Card
              cover={
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[6].thumbnail}`}
                  alt="news"
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              }
            >
              <p className="title">{newsList[6].category}</p>
              <Link href={`news/${newsList[6]._id}`}>
                <p className="content">{newsList[6].title}</p>
              </Link>
              <div className="publish-date">
                <DetailsButton
                  title={dayjs(newsList[6].publishDate).format('DD/MM/YYYY')}
                  height={28}
                />
              </div>
            </Card>
            <Card
              cover={
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[7].thumbnail}`}
                  alt="news"
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              }
            >
              <p className="title"> {newsList[7].category}</p>
              <Link href={`news/${newsList[7]._id}`}>
                <p className="content">{newsList[7].title}</p>
              </Link>
              <div className="publish-date">
                <DetailsButton
                  title={dayjs(newsList[7].publishDate).format('DD/MM/YYYY')}
                  height={28}
                />
              </div>
            </Card>
            <Card
              cover={
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsList[8].thumbnail}`}
                  alt="news"
                  fill={true}
                  sizes="(max-width: 788px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              }
            >
              <p className="title">{newsList[8].category}</p>
              <Link href={`news/${newsList[8]._id}`}>
                <p className="content">{newsList[8].title}</p>
              </Link>
              <div className="publish-date">
                <DetailsButton
                  title={dayjs(newsList[8].publishDate).format('DD/MM/YYYY')}
                  height={28}
                />
              </div>
            </Card>
          </Flex>
        </div>
      </div>
    </section>
  );
};

export default Section4;
