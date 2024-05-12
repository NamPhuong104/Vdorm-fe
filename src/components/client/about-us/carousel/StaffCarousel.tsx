'use client';

import {
  faFacebookSquare,
  faInstagram,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import Image from 'next/image';
import Slider from 'react-slick';

interface IProps {
  mockProfiles: { avatarUrl: string; fullName: string; role: string }[];
}

const StaffCarousel = (props: IProps) => {
  const { mockProfiles } = props;

  const settings = {
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    pauseOnHover: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 766,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '30px',
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 430,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '30px',
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {mockProfiles.map((profile, index) => {
        return (
          <div className="profile-container" key={index}>
            <Image
              src={profile.avatarUrl}
              alt="about-us"
              width={0}
              height={0}
              sizes="100vw"
              style={{ height: '100%', width: '100%', display: 'block' }}
            />
            <div className="staff-info">
              <p className="staff-name">{profile.fullName}</p>
              <p className="staff-role">{profile.role}</p>
              <Space size={'middle'}>
                <FontAwesomeIcon icon={faFacebookSquare} />
                <FontAwesomeIcon icon={faInstagram} />
                <FontAwesomeIcon icon={faTiktok} />
              </Space>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default StaffCarousel;
