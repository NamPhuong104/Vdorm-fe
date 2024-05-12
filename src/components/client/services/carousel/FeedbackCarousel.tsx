'use client';

import { Rate } from 'antd';
import Image from 'next/image';
import Slider from 'react-slick';

interface IProps {
  mockFeedbacks: {
    avatarUrl: string;
    fullName: string;
    star: number;
    feedback: string;
  }[];
}

const FeedbackCarousel = (props: IProps) => {
  const { mockFeedbacks } = props;

  const settings = {
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    pauseOnHover: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {mockFeedbacks.map((feedback, i) => {
        return (
          <div key={i} className="feedback-container">
            <Rate disabled defaultValue={feedback.star} />
            <b>{`${feedback.feedback}`}</b>
            <Image
              width={100}
              height={100}
              src={feedback.avatarUrl}
              alt={feedback.fullName}
            />
            <p>{feedback.fullName}</p>
          </div>
        );
      })}
    </Slider>
  );
};

export default FeedbackCarousel;
