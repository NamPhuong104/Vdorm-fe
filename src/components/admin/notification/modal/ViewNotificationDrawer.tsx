'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  notificationViewData: null | INotification;
  setNotificationViewData: (value: null | INotification) => void;
}

const ViewNotificationDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    notificationViewData,
    setNotificationViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setNotificationViewData(null);
  };

  return (
    <Drawer
      title="Thông tin thông báo"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-notification"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Người gửi: </Text>
          <Text>{notificationViewData?.sender}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tiêu đề: </Text>
          <Text>{notificationViewData?.title}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngày gửi: </Text>
          <Text>
            {dayjs(notificationViewData?.publishDate).format('DD/MM/YYYY')}
          </Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Nội dung: </Text>
          <Text>{notificationViewData?.content}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewNotificationDrawer;
