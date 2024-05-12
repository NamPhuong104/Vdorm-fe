'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import {
  faBroom,
  faBuildingColumns,
  faDumbbell,
  faLightbulb,
  faPersonSwimming,
  faShirt,
  faUtensils,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import FeedbackCarousel from './carousel/FeedbackCarousel';

const mockFeedbacks = [
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-05.jpg`,
    fullName: 'Trần Anh Đức',
    star: 5,
    feedback:
      'Phòng sạch sẽ, giá cả hợp lý, nhân viên thân thiện. Tôi thực sự hài lòng với dịch vụ và không gian sống ở ký túc xá Văn Lang.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-06.jpg`,
    fullName: 'Nguyễn Thị Hà',
    star: 5,
    feedback:
      'Vị trí thuận lợi, phòng rộng rãi, dịch vụ tốt. Tôi rất thích thú với trải nghiệm ở đây.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-05.jpg`,
    fullName: 'Lê Minh Hải',
    star: 5,
    feedback:
      'An ninh đảm bảo, giá cả phải chăng, không gian sống thoải mái. Tôi cảm thấy rất thoải mái khi ở đây.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-05.jpg`,
    fullName: 'Phạm Hoàng Long',
    star: 5,
    feedback:
      'Phòng thông minh, nhân viên chu đáo, môi trường sống tích cực. Tôi rất ấn tượng với dịch vụ tại ký túc xá này.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-05.jpg`,
    fullName: 'Nguyễn Minh Tuấn',
    star: 5,
    feedback:
      'Tiện nghi đầy đủ, cơ sở vật chất chuyên nghiệp. Tôi thực sự hài lòng với tiện ích tại đây.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-06.jpg`,
    fullName: 'Trần Thị Thu Hà',
    star: 5,
    feedback:
      'Cảm giác như ngôi nhà thứ hai, không gian yên tĩnh. Ký túc xá Văn Lang mang lại cho tôi cảm giác ấm cúng.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-05.jpg`,
    fullName: 'Nguyễn Văn Nam',
    star: 5,
    feedback:
      'Phòng sạch sẽ, giá cả hợp lý, dịch vụ chuyên nghiệp. Tôi rất ấn tượng với chất lượng dịch vụ.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-06.jpg`,
    fullName: 'Trần Thị Ngọc',
    star: 5,
    feedback:
      'Phòng rộng rãi, vị trí thuận lợi, không gian yên tĩnh. Tôi thực sự thích thú với môi trường sống tại đây.',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-05.jpg`,
    fullName: 'Nguyễn Thành Trung',
    star: 5,
    feedback:
      'Tiện nghi đầy đủ, nhân viên thân thiện, không gian sống thoải mái. Tôi sẽ giới thiệu ký túc xá này cho bạn bè.',
  },
];

const Services = () => {
  return (
    <div className={`client-services-container ${sheliaFont.variable}`}>
      <div
        className="client-services-thumbnail"
        style={{
          backgroundImage: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-01.jpg)`,
        }}
      >
        <div className="client-services-title">Dịch Vụ & Tiện Ích</div>
      </div>
      <div className="client-services-content">
        <section className="section-1">
          <div className="title">
            <b>CHÀO MỪNG ĐẾN VỚI KÝ TÚC XÁ VĂN LANG</b>
            <h1>Dịch Vụ & Tiện Ích</h1>
            <p className="sub-title">
              Với các tiện nghi hiện đại hàng đầu, tại đây chúng tôi tự hào mang
              đến cho bạn những dịch vụ và tiện ích tuyệt vời để đáp ứng mọi nhu
              cầu của bạn.
            </p>
          </div>
          <Row gutter={[20, 10]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faWifi} />
                <h2>Internet</h2>
                <p>Dịch vụ cung cấp kết nối Wifi và Internet tốc độ cao</p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faLightbulb} />
                <h2>Điện & Nước</h2>
                <p>Cung cấp dịch vụ điện và nước ổn định và đáng tin cậy</p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faBroom} />
                <h2>Dọn Phòng</h2>
                <p>Đảm bảo không gian ở của bạn luôn sạch sẽ và gọn gàng</p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faShirt} />
                <h2>Giặt Ủi</h2>
                <p>
                  Dịch vụ giặt ủi chuyên nghiệp, giúp bạn tiết kiệm thời gian và
                  công sức
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faPersonSwimming} />
                <h2>Hồ Bơi</h2>
                <p>
                  Thư giãn và tận hưởng những khoảnh khắc thư giãn sau một ngày
                  học tập căng thẳng
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faDumbbell} />
                <h2>Phòng Gym</h2>
                <p>
                  Trang bị phòng gym hiện đại với các thiết bị tập luyện đa dạng
                  và chất lượng
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faUtensils} />
                <h2>Canteen</h2>
                <p>
                  Cung cấp dịch vụ ẩm thực tại canteen với đa dạng các món ăn
                  ngon và bổ dưỡng
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
              <div className="services-container">
                <FontAwesomeIcon icon={faBuildingColumns} />
                <h2>Phòng Tự Học</h2>
                <p>
                  Phòng tự học yên tĩnh và tiện nghi để bạn tập trung vào việc
                  học tập và nghiên cứu
                </p>
              </div>
            </Col>
          </Row>
        </section>
        <section className="section-2">
          <Row>
            <Col
              xs={0}
              sm={0}
              md={0}
              lg={0}
              xl={9}
              xxl={9}
              className="first"
              style={{
                backgroundImage: `linear-gradient(to bottom, #0000008a, #00000042), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-02.jpg)`,
              }}
            ></Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={15}
              xxl={15}
              className="second"
            >
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={{ order: 1, span: 12 }}
                  xxl={{ order: 1, span: 12 }}
                  className="third"
                >
                  <div className="services-container">
                    <b>RIÊNG TƯ & AN TOÀN</b>
                    <h2>An Ninh 24/7</h2>
                    <p>
                      Hệ thống camera cùng đội ngũ bảo vệ được đào tạo chuyên
                      nghiệp đảm bảo an toàn cho toàn ký túc xá
                    </p>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={{ order: 2, span: 12 }}
                  xxl={{ order: 2, span: 12 }}
                  className="fourth"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, #0000008a, #00000042), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-03.jpg)`,
                  }}
                ></Col>
                <Col
                  xs={{ order: 4, span: 24 }}
                  sm={{ order: 4, span: 24 }}
                  md={{ order: 4, span: 24 }}
                  lg={{ order: 4, span: 24 }}
                  xl={{ order: 3, span: 12 }}
                  xxl={{ order: 3, span: 12 }}
                  className="fifth"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, #0000008a, #00000042), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/service/service-04.jpg)`,
                  }}
                ></Col>
                <Col
                  xs={{ order: 3, span: 24 }}
                  sm={{ order: 3, span: 24 }}
                  md={{ order: 3, span: 24 }}
                  lg={{ order: 3, span: 24 }}
                  xl={{ order: 4, span: 12 }}
                  xxl={{ order: 4, span: 12 }}
                  className="sixth"
                >
                  <div className="services-container">
                    <b>RIÊNG TƯ & AN TOÀN</b>
                    <h2>An Ninh 24/7</h2>
                    <p>
                      Hệ thống camera cùng đội ngũ bảo vệ được đào tạo chuyên
                      nghiệp đảm bảo an toàn cho toàn ký túc xá
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>
        <section className="section-3">
          <div className="title">
            <p>Cảm Nghĩ Của Cư Dân Về Chúng Tôi</p>
          </div>
          <FeedbackCarousel mockFeedbacks={mockFeedbacks} />
        </section>
      </div>
    </div>
  );
};

export default Services;
