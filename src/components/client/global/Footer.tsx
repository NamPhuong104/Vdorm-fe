import {
  faFacebookSquare,
  faInstagram,
  faTiktok,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Flex, Row, Space, Typography } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Link from 'next/link';
import ContactForm from './ContactForm';
import DormGoogleMap from './DormGoogleMap';

const { Title } = Typography;

const ClientFooter = () => {
  return (
    <Footer className="client-footer">
      <div className="footer-container">
        <div className="footer-main-content">
          <Row gutter={[0, 20]}>
            <Col xs={24} sm={24} md={24} lg={11} xl={11} xxl={11}>
              <ContactForm />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={{ span: 12, offset: 1 }}
              xl={{ span: 12, offset: 1 }}
              xxl={{ span: 12, offset: 1 }}
            >
              <div className="footer-address">
                <Title level={2}>Địa chỉ</Title>
                <Flex className="address">
                  <span>
                    <b>Chi nhánh 1:</b> 160/63A-B Phan Huy Ích, P. 12, Q. Gò
                    Vấp, TP. HCM
                  </span>
                </Flex>
                <Flex className="address">
                  <span>
                    <b>Chi nhánh 2:</b> 69/68 Đặng Thùy Trâm, P. 13, Q. Bình
                    Thạnh, TP. HCM
                  </span>
                </Flex>
              </div>
              <div>
                <DormGoogleMap />
              </div>
            </Col>
          </Row>
        </div>
        <div className="footer-copyright">
          <Flex justify="space-between" align="center">
            <span>
              © {dayjs().year()} - Bản Quyền Thuộc Ký Túc Xá, Trường Đại học Văn
              Lang.
            </span>
            <Space size={'middle'}>
              <Link
                target="_blank"
                href={'https://www.facebook.com/truongdaihocvanlang/'}
              >
                <FontAwesomeIcon icon={faFacebookSquare} />
              </Link>
              <Link
                target="_blank"
                href={'https://www.instagram.com/vanlanguniversity/'}
              >
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link
                target="_blank"
                href={'https://www.youtube.com/@vanlanguniversity'}
              >
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
              <Link
                target="_blank"
                href={'https://www.tiktok.com/@vanlanguniversity'}
              >
                <FontAwesomeIcon icon={faTiktok} />
              </Link>
            </Space>
          </Flex>
        </div>
      </div>
    </Footer>
  );
};

export default ClientFooter;
