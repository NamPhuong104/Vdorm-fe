'use client';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Flex, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  data: IContentHomeRoomType;
}

const Section2 = (props: IProps) => {
  const { contentList } = props.data;

  return (
    <section className="section-2">
      <div className="room-types-container">
        <Flex className="room-types-title" align="center" justify="center">
          <Title level={2}>Loại Phòng</Title>
          <Title level={3}>Hiện đại - Đẳng cấp - Tiện nghi</Title>
        </Flex>
        <Row className="room-types-list" gutter={[30, 10]}>
          {contentList?.map((content, index) => {
            return (
              <Col
                className="room-types-list-item"
                key={index}
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={6}
                xxl={6}
              >
                <Flex>
                  <div className="room-type-img">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${content?.image}`}
                      alt="room-type"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{
                        width: `100%`,
                        height: '100%',
                      }}
                    />
                  </div>
                  <div className="room-type-content">
                    <div>
                      <p className="room-type-title">{content?.title}</p>
                      <p className="room-type-subtitle">{content?.subTitle}</p>
                      <p className="room-type-description">
                        {content?.description}
                      </p>
                      <Link href={content?.route}>
                        <Button className="details-btn">
                          Khám phá ngay{' '}
                          <div className="see-more-icon">
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Flex>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
};

export default Section2;
