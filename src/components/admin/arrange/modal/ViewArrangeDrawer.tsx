'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  arrangeViewData: null | IRegistration;
  setArrangeViewData: (value: null | IRegistration) => void;
}

const ViewArrangeDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    arrangeViewData,
    setArrangeViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setArrangeViewData(null);
  };

  return (
    <Drawer
      title="Thông tin đơn đăng ký"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-arrange"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Mã số sinh viên: </Text>
          <Text>{arrangeViewData?.studentCode}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Họ và tên: </Text>
          <Text>{arrangeViewData?.fullName}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngày sinh: </Text>
          <Text>
            {dayjs(arrangeViewData?.dateOfBirth).format('DD/MM/YYYY')}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Giới tính: </Text>
          <Text>{arrangeViewData?.gender}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Khóa: </Text>
          <Text>{arrangeViewData?.course}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngành: </Text>
          <Text>{arrangeViewData?.major?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Email: </Text>
          <Text>{arrangeViewData?.email}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số điện thoại: </Text>
          <Text>{arrangeViewData?.phone}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Quê quán: </Text>
          <Text>{arrangeViewData?.homeTown}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Danh sách sở thích: </Text>
          <Text>{arrangeViewData?.hobbyList.join(', ')}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{arrangeViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Loại phòng: </Text>
          <Text>{arrangeViewData?.roomType?.name}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Trạng thái: </Text>
          <Text>{arrangeViewData?.status}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewArrangeDrawer;
