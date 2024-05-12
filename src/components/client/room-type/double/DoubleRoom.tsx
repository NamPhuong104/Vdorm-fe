'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import '@/styles/client/room-type-details.scss';
import {
  faBroom,
  faDumbbell,
  faSchool,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Flex, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import AnswerButton from '../../home/section-5/AnswerButton';

const DoubleRoom = () => {
  const { status } = useSession();

  return (
    <Content className={`client-room-type-details ${sheliaFont.variable}`}>
      <div className="room-type-details-title">
        <h1>Phòng Đôi</h1>
      </div>
      <div className="room-type-details-content">
        <section className="section-1">
          <Row>
            <Col xs={24} sm={24} md={12} span={12}>
              <div>
                <h2>Phòng Đôi</h2>
                <p>
                  Phòng đôi tại ký túc xá Trường Đại học Văn Lang là một lựa
                  chọn lý tưởng cho sinh viên đang tìm kiếm một không gian sống
                  thuận tiện và thoải mái.
                </p>
              </div>
              <div>
                <p>2 GIƯỜNG ĐƠN 180x160</p>
                <p>BẾP TRANG BỊ ĐẦY ĐỦ</p>
                <p>NHÀ TẮM RIÊNG</p>
                <p>BAN CÔNG VIEW KHUÔN VIÊN TRƯỜNG</p>
              </div>
              {status === 'authenticated' ? (
                <Link href={'/room-register'}>
                  <Button className="room-regist-btn">Đặt phòng ngay</Button>
                </Link>
              ) : (
                <Button
                  className="room-regist-btn"
                  onClick={() =>
                    signIn('azure-ad', {
                      callbackUrl: '/room-register',
                    })
                  }
                >
                  Đặt phòng ngay
                </Button>
              )}
            </Col>
            <Col xs={24} sm={24} md={12} span={12}>
              <div className="image-wrapper">
                <Image
                  fill={true}
                  src="https://images.unsplash.com/photo-1631630259742-c0f0b17c6c10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="room-type-details-image-01"
                  sizes="100vw"
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} span={24}>
              <div className="stripe"></div>
              <div className="stripe"></div>
              <div className="stripe"></div>
            </Col>
          </Row>
        </section>
        <section className="section-2">
          <Row gutter={30}>
            <Col span={8}>
              <div className="image-wrapper">
                <Image
                  fill={true}
                  alt="bedroom-picture"
                  src="https://plus.unsplash.com/premium_photo-1682394265183-68113f05a103?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  sizes="100vw"
                />
              </div>
            </Col>
            <Col span={16}>
              <div className="image-wrapper">
                <Image
                  fill={true}
                  alt="bedroom-picture"
                  src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  sizes="100vw"
                />
              </div>
            </Col>
          </Row>
        </section>
        <section className="section-3">
          <Row>
            <Col
              xs={{ order: 1, span: 24 }}
              sm={{ order: 1, span: 24 }}
              md={{ order: 1, span: 12 }}
              lg={{ order: 1, span: 12 }}
              xl={{ order: 1, span: 9 }}
              xxl={{ order: 1, span: 9 }}
            >
              <div className="image-wrapper">
                <Image
                  fill={true}
                  src="https://hotellerv6-5.b-cdn.net/lifestyle/wp-content/uploads/sites/3/2023/09/primary-bedroom-floor-plan.jpg"
                  alt="room-type-details-image-01"
                  sizes="100vw"
                />
              </div>
            </Col>
            <Col
              xs={{ order: 3, span: 24 }}
              sm={{ order: 3, span: 24 }}
              md={{ order: 2, span: 24 }}
              lg={{ order: 2, span: 24 }}
              xl={{ order: 2, span: 24 }}
              xxl={{ order: 2, span: 24 }}
            >
              <div className="stripe"></div>
              <div className="stripe"></div>
              <div className="stripe"></div>
            </Col>
            <Col
              xs={{ order: 2, span: 24 }}
              sm={{ order: 2, span: 24 }}
              md={{ order: 3, span: 12 }}
              lg={{ order: 1, span: 12 }}
              xl={{ order: 1, span: 15 }}
              xxl={{ order: 1, span: 15 }}
            >
              <h3>Tiện ích & Dịch vụ</h3>
              <div className="services-list">
                <span>
                  <h4>Tiện ích</h4>
                  <ul>
                    <li>TV LED 40-INCH</li>
                    <li>PHÒNG TẮM RIÊNG</li>
                    <li>GIƯỜNG 180 X 160 CM</li>
                    <li>TỦ LẠNH 10L</li>
                    <li>MÁY LẠNH</li>
                    <li>BÀN HỌC & TỦ SÁCH</li>
                    <li>TỦ QUẦN ÁO</li>
                    <li>NỘI THẤT ĐẦY ĐỦ</li>
                    <li>TỦ LẠNH 10L</li>
                  </ul>
                </span>
                <span>
                  <h4>Dịch vụ</h4>
                  <ul>
                    <li>ĐIỆN NƯỚC</li>
                    <li>LỄ TÂN 24/7</li>
                    <li>THU GOM RÁC</li>
                    <li>KHÓA VÂN TAY</li>
                    <li>WIFI TỐC ĐỘ CAO</li>
                    <li>ĐIỆN NƯỚC</li>
                    <li>LỄ TÂN 24/7</li>
                    <li>THU GOM RÁC</li>
                    <li>KHÓA VÂN TAY</li>
                  </ul>
                </span>
              </div>
            </Col>
          </Row>
        </section>
        <section className="section-4">
          <Row>
            <Col
              xs={{ order: 2, span: 24 }}
              sm={{ order: 2, span: 24 }}
              md={{ order: 1, span: 2 }}
              lg={{ order: 1, span: 2 }}
              xl={{ order: 1, span: 2 }}
              xxl={{ order: 1, span: 1 }}
            >
              <div className="stripe"></div>
              <div className="stripe"></div>
              <div className="stripe"></div>
            </Col>
            <Col
              xs={{ order: 1, span: 24 }}
              sm={{ order: 1, span: 24 }}
              md={{ order: 2, span: 22 }}
              lg={{ order: 2, span: 22 }}
              xl={{ order: 2, span: 22 }}
              xxl={{ order: 2, span: 23 }}
            >
              <div className="wrapper">
                <h4>Dịch vụ tính phí & Cơ sở vật chất</h4>
                <div className="services-container">
                  <span>
                    <FontAwesomeIcon icon={faUtensils} />
                    <h5>THỨC ĂN</h5>
                    <p>
                      Bạn không cần phải rời khỏi phòng để thưởng thức bữa ăn
                      ngon lành. Chúng tôi cung cấp dịch vụ giao hàng tận phòng,
                      nhanh chóng và tiện lợi. Chỉ cần đặt hàng và chờ đợi,
                      chúng tôi sẽ đưa bữa ăn trực tiếp đến cửa phòng của bạn.
                    </p>
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faBroom} />
                    <h5>DỌN PHÒNG</h5>
                    <p>
                      Đội ngũ nhân viên chuyên nghiệp của chúng tôi sẽ đến phòng
                      của bạn để làm sạch, lau dọn và bố trí lại nội thất. Việc
                      dọn phòng định kỳ sẽ giúp duy trì môi trường sống sạch sẽ
                      và gọn gàng cho bạn.
                    </p>
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDumbbell} />
                    <h5>PHÒNG GYM</h5>
                    <p>
                      Phòng gym của chúng tôi được trang bị các thiết bị tập
                      luyện đa dạng và hiện đại như máy chạy bộ, xe đạp tập, máy
                      tập cơ bụng, máy tập ngực, máy tập chân, tạ và các dụng cụ
                      tập luyện khác.
                    </p>
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faSchool} />
                    <h5>PHÒNG TỰ HỌC</h5>
                    <p>
                      Các phòng tự học được thiết kế để tạo ra một môi trường
                      yên tĩnh và tĩnh lặng. Điều này giúp sinh viên tập trung
                      vào công việc học mà không bị xao lạc bởi tiếng ồn bên
                      ngoài.
                    </p>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </section>
        <section className="section-5">
          <Row>
            <Col xs={24} sm={24} md={10} lg={8} xl={8} xxl={8}>
              <div className="image-wrapper">
                <Image
                  fill={true}
                  alt="room-picture"
                  src="https://images.unsplash.com/photo-1569335468888-1d3e4a5a3595?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  sizes="100vw"
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={14} lg={16} xl={16} xxl={16}>
              <div className="common-questions-container">
                <Flex
                  className="common-questions-title"
                  align="center"
                  justify="center"
                >
                  <Title level={2}>Câu hỏi thường gặp</Title>
                </Flex>
                <div className="common-questions-content">
                  <AnswerButton
                    question="Tôi cần đăng ký phòng ở ký túc xá Văn Lang phải làm thủ tục như thế nào?"
                    answer="Bạn có thể đăng ký chỗ ở tại Ký Túc Xá Văn Lang qua hệ thống trực tuyến trên trang web chính thức của trường hoặc liên hệ trực tiếp với phòng quản lý ký túc xá."
                  />
                </div>
                <div className="common-questions-content">
                  <AnswerButton
                    question="Ký túc xá Văn Lang có cung cấp dịch vụ giặt là và là ủi không?"
                    answer="Thông thường, Ký Túc Xá ưu tiên đăng ký cho sinh viên năm nhất trong thời gian được thông báo trước, thường là trước khi năm học mới bắt đầu."
                  />
                </div>
                <div className="common-questions-content">
                  <AnswerButton
                    question="Chính sách hủy phòng như thế nào? Có mất phí hủy không?"
                    answer="Ký Túc Xá cung cấp nhiều loại phòng, bao gồm phòng đôi, phòng đôi, phòng ba, và phòng sáu với các tiện nghi đầy đủ."
                  />
                </div>
                <div className="common-questions-content">
                  <AnswerButton
                    question="Tôi có thể mang theo thú cưng khi ở ký túc xá Văn Lang không?"
                    answer="Ký Túc Xá cung cấp nhiều loại phòng, bao gồm phòng đôi, phòng đôi, phòng ba, và phòng sáu với các tiện nghi đầy đủ."
                  />
                </div>
                <div className="common-questions-content">
                  <AnswerButton
                    question="Ký túc xá Văn Lang có chính sách về an ninh và an toàn như thế nào?"
                    answer="Ký Túc Xá cung cấp nhiều loại phòng, bao gồm phòng đôi, phòng đôi, phòng ba, và phòng sáu với các tiện nghi đầy đủ."
                  />
                </div>
                <div className="common-questions-content">
                  <AnswerButton
                    question="Tôi cần mang theo những giấy tờ gì khi đến đăng ký phòng ở ký túc xá Văn Lang?"
                    answer="Ký Túc Xá cung cấp nhiều loại phòng, bao gồm phòng đôi, phòng đôi, phòng ba, và phòng sáu với các tiện nghi đầy đủ."
                  />
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    </Content>
  );
};

export default DoubleRoom;
