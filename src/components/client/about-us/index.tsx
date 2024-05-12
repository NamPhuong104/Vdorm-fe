'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Carousel, Col, Flex, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Image from 'next/image';
import StaffCarousel from './carousel/StaffCarousel';

const mockProfiles = [
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-10.jpg`,
    fullName: 'Harper Mitchell',
    role: 'Quản lý Ký túc xá',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-11.jpg`,
    fullName: 'Oliver Reynolds',
    role: 'Trưởng Ban Hỗ Trợ Sinh viên',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-12.jpg`,
    fullName: 'Isabella Thompson',
    role: 'Trưởng Ban Sự kiện',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-13.jpg`,
    fullName: 'Ethan Davidson',
    role: 'Giám sát Bảo trì',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-14.jpg`,
    fullName: 'Sophia Carter',
    role: 'Trưởng Ban Phát triển Sinh viên',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-15.jpg`,
    fullName: 'Benjamin Hayes',
    role: 'Trưởng Ban An Ninh',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-16.jpg`,
    fullName: 'Ava Simmons',
    role: 'Trợ lý Hành chính',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-17.jpg`,
    fullName: 'Noah Anderson',
    role: 'Hỗ trợ Công nghệ Thông tin',
  },
  {
    avatarUrl: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-18.jpg`,
    fullName: 'Grace Parker',
    role: 'Trưởng Ban Y Tế',
  },
];

const AboutUs = () => {
  return (
    <div className={`client-about-us ${sheliaFont.variable}`}>
      <Content>
        <div className="client-abous-us-content">
          <div
            className="client-about-us-thumbnail"
            style={{
              backgroundImage: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-01.jpg)`,
            }}
          >
            <div className="client-about-us-thumbnail-title">
              <span>Về Chúng Tôi</span>
            </div>
          </div>
          <div className="client-about-us-main-content">
            <section className="section-1">
              <Row
                className="content-container"
                gutter={[40, 10]}
                align={'top'}
                justify={'center'}
              >
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={13}
                  xxl={14}
                  className="images-container"
                >
                  <div className="images-container-01">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-02.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '50%', height: '30vh' }}
                    />
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-03.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '50%', height: '30vh' }}
                    />
                  </div>
                  <div className="images-container-02">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-04.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: '40vh' }}
                    />
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={11}
                  xxl={10}
                  className="main-content-container"
                >
                  <span className="title">Khám phá Ký Túc Xá Văn Lang</span>
                  <span className="sub-title">
                    Nơi ở lý tưởng dành cho tân sinh viên
                  </span>
                  <div className="main-content">
                    <span>
                      Chào mừng bạn đến với Ký túc xá Văn Lang - Ngôi nhà thứ
                      hai cho hành trình học tập của bạn! Chúng tôi tự hào là
                      một địa điểm, không gian sống lý tưởng, nơi cung cấp chất
                      lượng và môi trường học tập tích cực cho sinh viên.
                    </span>
                    <span>
                      Tọa lạc tại vị trí thuận lợi, Ký túc xá Văn Lang không chỉ
                      mang lại sự thuận tiện cho việc di chuyển mà còn đem đến
                      trải nghiệm sống đa dạng. Với quy mô hiện đại và tiện ích
                      đầy đủ, chúng tôi cam kết tạo ra một môi trường sống tốt
                      nhất cho sinh viên của Trường Đại học Văn Lang.
                    </span>
                  </div>
                </Col>
              </Row>
            </section>
            <section className="section-2">
              <div className="history-container">
                <span className="title">Quá trình phát triển Ký Túc Xá</span>
                <span className="sub-title">
                  Hành trình của chúng tôi bắt nguồn từ tầm nhìn mang tính đổi
                  mới và sự cam kết vững vàng của đội ngũ quản lý. Với nhiều năm
                  kinh nghiệm, chúng tôi đã liên tục nỗ lực để cải thiện và phát
                  triển, đồng hành cùng sự thành công của sinh viên Văn Lang.
                </span>
                <Carousel autoplay>
                  <div className="carousel-child">
                    <div className="content">
                      <span className="year">2020</span>
                      <span className="text">
                        Ý tưởng về Ký túc xá Văn Lang đã xuất phát từ tầm nhìn
                        và niềm tin rằng không gian sống và học tập chất lượng
                        có thể đóng vai trò quan trọng trong sự phát triển cá
                        nhân của sinh viên. Với tầm nhìn đổi mới và sự cam kết
                        không ngừng, chúng tôi bắt đầu hành trình xây dựng nên
                        tổ ấm thứ hai cho sinh viên Văn Lang.
                      </span>
                    </div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-05.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="carousel-child">
                    <div className="content">
                      <span className="year">2021</span>
                      <span className="text">
                        Từ những ngày đầu tiên của hành trình hình thành, Ký túc
                        xá Văn Lang đã chứng kiến sự phát triển đầy ngoạn mục,
                        trở thành một điểm đặc biệt trong cộng đồng sinh viên.
                        Chúng tôi mang theo một câu chuyện đầy kỳ vọng và tình
                        yêu thương, gắn bó mạnh mẽ với sự phát triển của Trường
                        Đại học Văn Lang.
                      </span>
                    </div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-06.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="carousel-child">
                    <div className="content">
                      <span className="year">2022</span>
                      <span className="text">
                        Dòng chảy thời gian đã chứng kiến sự phát triển liên tục
                        của Ký túc xá Văn Lang. Từ việc mở rộng quy mô cho đến
                        việc nâng cấp tiện ích và dịch vụ, chúng tôi luôn tự hào
                        về sự đổi mới và sáng tạo. Những kết quả đáng kể này đều
                        là nhờ vào tình yêu thương và đóng góp tích cực từ cả
                        cộng đồng sinh viên và đội ngũ quản lý.
                      </span>
                    </div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-07.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="carousel-child">
                    <div className="content">
                      <span className="year">2023</span>
                      <span className="text">
                        Với những nỗ lực không ngừng và lòng nhiệt thành, Ký túc
                        xá Văn Lang tỏa sáng như một biểu tượng của sự phồn
                        thịnh và thành công trong hành trình hỗ trợ sự phát
                        triển của sinh viên. Chúng tôi tin rằng mỗi sinh viên là
                        một phần quan trọng, và chúng tôi luôn là nguồn động
                        viên lớn nhất cho mọi giấc mơ và hoài bão của họ.
                      </span>
                    </div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-08.jpg`}
                      alt="about-us"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </Carousel>
              </div>
            </section>
            <section className="section-3">
              <div
                className="goals-container"
                style={{
                  backgroundImage: `linear-gradient(to bottom,
                    rgba(0, 0, 0, 0.9),
                    rgba(0, 0, 0, 0.6)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/about-us/about-us-09.jpg)`,
                }}
              >
                <span className="title">Sứ mệnh & Mục tiêu</span>
                <Row gutter={[40, 20]}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <div className="sub-title">SỨ MỆNH</div>
                    <div className="dash"></div>
                    <div className="content">
                      Tạo ra một nơi mà mọi sinh viên có thể phát triển toàn
                      diện, xây dựng cộng đồng đa dạng và có tâm huyết.
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <div className="sub-title">MỤC TIÊU</div>
                    <div className="dash"></div>
                    <div className="content">
                      Trở thành một trong những trường đại học có ký túc xá chất
                      lượng nhất châu Á.
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="sub-title">GIÁ TRỊ CỐT LÕI</div>
                    <div className="dash"></div>
                    <Flex
                      justify="space-between"
                      align="center"
                      className="values"
                    >
                      <div>
                        <FontAwesomeIcon icon={faHashtag} />
                        Chất lượng
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faHashtag} />
                        Đa dạng
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faHashtag} />
                        An toàn
                      </div>
                    </Flex>
                  </Col>
                </Row>
              </div>
            </section>
            <section className="section-4">
              <div className="staff-container">
                <span className="title">Đội ngũ Ký Túc Xá Văn Lang</span>
                <div className="staff-carousel">
                  <StaffCarousel mockProfiles={mockProfiles} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AboutUs;
