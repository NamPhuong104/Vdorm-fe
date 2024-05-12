'use client';

import { Flex, Image, Modal, Typography } from 'antd';
import dayjs from 'dayjs';
import { Markup } from 'interweave';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';

interface IProps {
  isViewModalOpen: boolean;
  setIsViewModalOpen: (value: boolean) => void;
  newsViewData: null | INew;
  setNewsViewData: (value: null | INew) => void;
}

const ViewNewsModal = (props: IProps) => {
  const { isViewModalOpen, setIsViewModalOpen, newsViewData, setNewsViewData } =
    props;
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setNewsViewData(null);
  };

  return (
    <Modal
      centered
      open={isViewModalOpen}
      onCancel={handleCloseViewModal}
      footer={null}
      width={screenSize === 'xs' || screenSize === 'sm' ? '90vw' : '70vw'}
      style={{ margin: '30px 0 30px' }}
    >
      <Typography.Title
        level={screenSize === 'xs' || screenSize === 'sm' ? 3 : 2}
        style={{ margin: '30px 0px 20px', textAlign: 'justify' }}
      >
        {newsViewData?.title}
      </Typography.Title>
      <Flex gap={'10px'} align="center" style={{ marginBottom: '5px' }}>
        <Typography.Text strong style={{ fontSize: '17px' }}>
          Danh mục:{' '}
        </Typography.Text>
        <Typography.Text style={{ fontSize: '17px' }}>
          {newsViewData?.category}
        </Typography.Text>
      </Flex>
      <Flex gap={'10px'} align="center" style={{ marginBottom: '5px' }}>
        <Typography.Text strong style={{ fontSize: '17px' }}>
          Tác giả:{' '}
        </Typography.Text>
        <Typography.Text style={{ fontSize: '17px' }}>
          {newsViewData?.author}
        </Typography.Text>
      </Flex>
      <Flex gap={'10px'} align="center" style={{ marginBottom: '30px' }}>
        <Typography.Text strong style={{ fontSize: '17px' }}>
          Ngày:{' '}
        </Typography.Text>
        <Typography.Text style={{ fontSize: '17px' }}>
          {dayjs(newsViewData?.publishDate).format('DD/MM/YYYY')}
        </Typography.Text>
      </Flex>
      <Flex align="center" justify="center" style={{ marginBottom: '15px' }}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${newsViewData?.thumbnail}`}
          alt="news-thumbnail"
          width={'100%'}
          height={'100%'}
        />
      </Flex>
      <Markup
        className="view-news ck-content"
        content={newsViewData?.content}
      />
    </Modal>
  );
};

export default ViewNewsModal;
