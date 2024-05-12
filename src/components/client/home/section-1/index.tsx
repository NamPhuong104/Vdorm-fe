'use client';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Flex, Row, Space } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { Button } from 'antd/lib';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  data: IContentHomeAboutUs;
}

const Section1 = (props: IProps) => {
  const { contentList } = props.data;

  return (
    <section className="section-1">
      <div className="about-us-container">
        <Row>
          <Col xs={0} sm={0} md={12} lg={12} xl={12} xxl={12}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${contentList[0]?.image}`}
              alt="about-us"
              priority
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Space size={'middle'} wrap={true}>
              <Flex className="about-us-title" justify="center">
                <Title level={2}>Về chúng tôi</Title>
              </Flex>
              <div className="about-us-content">
                <Paragraph>{contentList[0]?.firstParagraph}</Paragraph>
                <Paragraph>{contentList[0]?.secondParagraph}</Paragraph>
              </div>
              <Link href={'/about-us'}>
                <Button className="details-btn">
                  Xem chi tiết
                  <div className="see-more-icon">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Section1;
