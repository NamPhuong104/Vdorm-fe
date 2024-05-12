'use client';

import { Image } from 'antd';
import Slider from 'react-slick';

const ImageCarousel = (props: { urls: string[] }) => {
  const settings = {
    centerMode: true,
    centerPadding: '140px',
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
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
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 765,
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
      {props.urls.map((url, index) => {
        return <Image preview={false} src={url} alt={url} key={index} />;
      })}
    </Slider>
  );
};

export default ImageCarousel;
