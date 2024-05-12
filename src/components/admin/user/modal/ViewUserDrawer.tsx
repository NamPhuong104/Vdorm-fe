'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  userViewData: null | IUser;
  setUserViewData: (value: null | IUser) => void;
}

const ViewUserDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    userViewData,
    setUserViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setUserViewData(null);
  };

  return (
    <Drawer
      title="Thông tin nhân viên"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-user"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Mã số: </Text>
          <Text>{userViewData?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Họ và tên: </Text>
          <Text>{userViewData?.fullName}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngày sinh: </Text>
          <Text>
            {userViewData?.dateOfBirth
              ? dayjs(userViewData?.dateOfBirth).format('DD/MM/YYYY')
              : ''}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Email: </Text>
          <Text>{userViewData?.email}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số điện thoại: </Text>
          <Text>{userViewData?.phone}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Chức vụ: </Text>
          <Text>{userViewData?.role?.name}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Trạng thái: </Text>
          <Text>
            {userViewData?.isActive === false ? 'Không hoạt động' : 'Hoạt động'}
          </Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewUserDrawer;
