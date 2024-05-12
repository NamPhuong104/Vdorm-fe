'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  registrationViewData: null | IRegistration;
  setRegistrationViewData: (value: null | IRegistration) => void;
}

const ViewRegistrationDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    registrationViewData,
    setRegistrationViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setRegistrationViewData(null);
  };

  return (
    <Drawer
      title="Thông tin đơn đăng ký"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-registration"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Mã số sinh viên: </Text>
          <Text>{registrationViewData?.studentCode}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Họ và tên: </Text>
          <Text>{registrationViewData?.fullName}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngày sinh: </Text>
          <Text>
            {dayjs(registrationViewData?.dateOfBirth).format('DD/MM/YYYY')}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Giới tính: </Text>
          <Text>{registrationViewData?.gender}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Khóa: </Text>
          <Text>{registrationViewData?.course}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngành: </Text>
          <Text>{registrationViewData?.major?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Email: </Text>
          <Text>{registrationViewData?.email}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số điện thoại: </Text>
          <Text>{registrationViewData?.phone}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Quê quán: </Text>
          <Text>{registrationViewData?.homeTown}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Danh sách sở thích: </Text>
          <Text>{registrationViewData?.hobbyList.join(', ')}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{registrationViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Loại phòng: </Text>
          <Text>{registrationViewData?.roomType?.name}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Trạng thái: </Text>
          <Text>{registrationViewData?.status}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewRegistrationDrawer;
