'use client';

import {
  faBuilding,
  faComputer,
  faGear,
  faHandshake,
  faListCheck,
  faLocationPinLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Flex, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';

interface IProps {
  data: IContentHomeServiceType;
}

const Section3 = (props: IProps) => {
  const { contentList } = props.data;
  const [childrenContentList, setChildrenContentList] = useState<
    { title: string; description: string }[]
  >([]);

  useEffect(() => {
    if (contentList) {
      const contentListClone = [...contentList];
      contentListClone.shift();
      setChildrenContentList(contentListClone);
    }
  }, [contentList]);

  return (
    <section className="section-3">
      <div className="services-container">
        <Row gutter={[0, 20]} justify={'space-between'}>
          <Col xs={24} sm={24} md={24} lg={10} xl={6} xxl={6}>
            <Flex align="center" justify="center" style={{ height: '100%' }}>
              <div className="services-title">
                <Title level={2}>{contentList[0]?.title}</Title>
                <p>{contentList[0]?.description}</p>
              </div>
            </Flex>
          </Col>
          <Col
            className="services-list"
            xs={24}
            sm={24}
            md={24}
            lg={{ span: 13, offset: 1 }}
            xl={{ span: 16, offset: 1 }}
            xxl={{ span: 16, offset: 1 }}
          >
            <Row gutter={[10, 20]}>
              {childrenContentList?.map((content, index) => {
                return (
                  <Col
                    key={index}
                    xs={24}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={8}
                    xxl={8}
                  >
                    <Card
                      className="services-list-item"
                      title={
                        <FontAwesomeIcon
                          size="2x"
                          icon={
                            index === 0
                              ? faBuilding
                              : index === 1
                              ? faComputer
                              : index === 2
                              ? faHandshake
                              : index === 3
                              ? faListCheck
                              : index === 4
                              ? faLocationPinLock
                              : faGear
                          }
                        />
                      }
                    >
                      <p className="services-list-item-title">
                        {content?.title}
                      </p>
                      <p className="services-list-item-content">
                        {content?.description}
                      </p>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Section3;
