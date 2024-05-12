'use client';

import Image from 'next/image';
import Slider from 'react-slick';

const RoomCarousel = (props: { urls: string[] }) => {
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {props.urls.map((url, index) => {
        return (
          <div key={index} className="image-container">
            <Image
              src={url}
              alt="image"
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              style={{ height: '100%', width: '100%', display: 'block' }}
            />
          </div>
        );
      })}
    </Slider>
  );
};

export default RoomCarousel;
