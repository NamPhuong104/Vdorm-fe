'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import { FaKitchenSet } from 'react-icons/fa6';
import { GiTempleDoor, GiWashingMachine } from 'react-icons/gi';
import { TbAirConditioning } from 'react-icons/tb';
import ImageCarousel from './carousel/ImageCarousel';
import RoomCarousel from './carousel/RoomCarousel';

const mockSingleImages = [
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-02.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-03.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-04.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-05.jpg`,
];

const mockDoubleImages = [
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-06.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-07.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-08.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-09.jpg`,
];

const mockTripleImages = [
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-10.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-11.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-12.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-13.jpg`,
];

const mockSextupleImages = [
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-14.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-15.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-16.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-17.jpg`,
];

const mockDormitoryImages = [
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-18.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-19.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-20.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-21.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-22.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-23.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-24.jpg`,
  `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-25.jpg`,
];

const RoomType = () => {
  return (
    <div className={`client-room-type-container ${sheliaFont.variable}`}>
      <div
        className="client-room-type-title"
        style={{
          backgroundImage: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/room-type/room-type-01.jpg)`,
        }}
      >
        <Title level={1}>Phòng</Title>
      </div>
      <div className="client-room-type-content">
        <section className="section-1">
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
              <div className="content">
                <div>
                  <p className="title">Phòng Đơn</p>
                  <p className="description">
                    - Không gian sống riêng tư và thoải mái -
                  </p>
                </div>
                <div className="sub-content">
                  <p className="sub-title">Diện tích</p>
                  <p className="sub-title-description">
                    15 m<sup>2</sup>
                  </p>
                  <p className="sub-title">Phòng</p>
                  <p className="sub-title-description">1 phòng tắm</p>
                  <p className="sub-title-description">
                    1 phòng ngủ: 1 giường đơn
                  </p>
                  <p className="sub-title">Tiện ích</p>
                  <Space size={'large'}>
                    <div>
                      <FaKitchenSet />
                      <p>Bếp</p>
                    </div>
                    <div>
                      <TbAirConditioning />
                      <p>Máy lạnh</p>
                    </div>
                    <div>
                      <GiWashingMachine />
                      <p>Máy giặt</p>
                    </div>
                    <div>
                      <GiTempleDoor />
                      <p>Ban công</p>
                    </div>
                  </Space>
                </div>
              </div>
              <Link href={'/room-type/single'}>
                <Button className="details-btn">
                  Xem chi tiết
                  <div className="see-more-icon">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Button>
              </Link>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
              <RoomCarousel urls={mockSingleImages} />
            </Col>
          </Row>
        </section>
        <section className="section-2">
          <Row>
            <Col
              xs={{ order: 2, span: 24 }}
              sm={{ order: 2, span: 24 }}
              md={{ order: 2, span: 24 }}
              lg={{ order: 2, span: 24 }}
              xl={{ order: 1, span: 12 }}
              xxl={{ order: 1, span: 12 }}
            >
              <RoomCarousel urls={mockDoubleImages} />
            </Col>
            <Col
              xs={{ order: 1, span: 24 }}
              sm={{ order: 1, span: 24 }}
              md={{ order: 1, span: 24 }}
              lg={{ order: 1, span: 24 }}
              xl={{ order: 2, span: 12 }}
              xxl={{ order: 2, span: 12 }}
            >
              <div className="content">
                <div>
                  <p className="title">Phòng Đôi</p>
                  <p className="description">
                    - Không gian sống chia sẻ và gắn kết -
                  </p>
                </div>
                <div className="sub-content">
                  <p className="sub-title">Diện tích</p>
                  <p className="sub-title-description">
                    25 m<sup>2</sup>
                  </p>
                  <p className="sub-title">Phòng</p>
                  <p className="sub-title-description">1 phòng tắm</p>
                  <p className="sub-title-description">
                    1 phòng ngủ: 2 giường đơn
                  </p>
                  <p className="sub-title">Tiện ích</p>
                  <Space size={'large'}>
                    <div>
                      <FaKitchenSet />
                      <p>Bếp</p>
                    </div>
                    <div>
                      <TbAirConditioning />
                      <p>Máy lạnh</p>
                    </div>
                    <div>
                      <GiWashingMachine />
                      <p>Máy giặt</p>
                    </div>
                    <div>
                      <GiTempleDoor />
                      <p>Ban công</p>
                    </div>
                  </Space>
                </div>
              </div>
              <Link href={'/room-type/double'}>
                <Button className="details-btn">
                  Xem chi tiết
                  <div className="see-more-icon">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Button>
              </Link>
            </Col>
          </Row>
        </section>
        <section className="section-3">
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
              <div className="content">
                <div>
                  <p className="title">Phòng Ba</p>
                  <p className="description">
                    - Không gian sống đồng hành và chia sẻ -
                  </p>
                </div>
                <div className="sub-content">
                  <p className="sub-title">Diện tích</p>
                  <p className="sub-title-description">
                    35 m<sup>2</sup>
                  </p>
                  <p className="sub-title">Phòng</p>
                  <p className="sub-title-description">1 phòng tắm</p>
                  <p className="sub-title-description">
                    1 phòng ngủ: 3 giường đơn
                  </p>
                  <p className="sub-title">Tiện ích</p>
                  <Space size={'large'}>
                    <div>
                      <FaKitchenSet />
                      <p>Bếp</p>
                    </div>
                    <div>
                      <TbAirConditioning />
                      <p>Máy lạnh</p>
                    </div>
                    <div>
                      <GiWashingMachine />
                      <p>Máy giặt</p>
                    </div>
                    <div>
                      <GiTempleDoor />
                      <p>Ban công</p>
                    </div>
                  </Space>
                </div>
              </div>
              <Link href={'/room-type/triple'}>
                <Button className="details-btn">
                  Xem chi tiết
                  <div className="see-more-icon">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Button>
              </Link>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
              <RoomCarousel urls={mockTripleImages} />
            </Col>
          </Row>
        </section>
        <section className="section-4">
          <Row>
            <Col
              xs={{ order: 2, span: 24 }}
              sm={{ order: 2, span: 24 }}
              md={{ order: 2, span: 24 }}
              lg={{ order: 2, span: 24 }}
              xl={{ order: 1, span: 12 }}
              xxl={{ order: 1, span: 12 }}
            >
              <RoomCarousel urls={mockSextupleImages} />
            </Col>
            <Col
              xs={{ order: 1, span: 24 }}
              sm={{ order: 1, span: 24 }}
              md={{ order: 1, span: 24 }}
              lg={{ order: 1, span: 24 }}
              xl={{ order: 2, span: 12 }}
              xxl={{ order: 2, span: 12 }}
            >
              <div className="content">
                <div>
                  <p className="title">Phòng Sáu</p>
                  <p className="description">
                    - Không gian sống đồng hành và chia sẻ -
                  </p>
                </div>
                <div className="sub-content">
                  <p className="sub-title">Diện tích</p>
                  <p className="sub-title-description">
                    55 m<sup>2</sup>
                  </p>
                  <p className="sub-title">Phòng</p>
                  <p className="sub-title-description">1 phòng tắm</p>
                  <p className="sub-title-description">
                    1 phòng ngủ: 3 giường tầng
                  </p>
                  <p className="sub-title">Tiện ích</p>
                  <Space size={'large'}>
                    <div>
                      <FaKitchenSet />
                      <p>Bếp</p>
                    </div>
                    <div>
                      <TbAirConditioning />
                      <p>Máy lạnh</p>
                    </div>
                    <div>
                      <GiWashingMachine />
                      <p>Máy giặt</p>
                    </div>
                    <div>
                      <GiTempleDoor />
                      <p>Ban công</p>
                    </div>
                  </Space>
                </div>
              </div>
              <Link href={'/room-type/sextuple'}>
                <Button className="details-btn">
                  Xem chi tiết
                  <div className="see-more-icon">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Button>
              </Link>
            </Col>
          </Row>
        </section>
        <section className="section-5">
          <p className="title">Hình Ảnh Ký Túc Xá Văn Lang</p>
          <ImageCarousel urls={mockDormitoryImages} />
        </section>
      </div>
    </div>
  );
};

export default RoomType;
