'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  studentViewData: null | IStudent;
  setStudentViewData: (value: null | IStudent) => void;
}

const ViewStudentDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    studentViewData,
    setStudentViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setStudentViewData(null);
  };

  return (
    <Drawer
      title="Thông tin sinh viên"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-student"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>MSSV: </Text>
          <Text>{studentViewData?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Họ và tên: </Text>
          <Text>{studentViewData?.fullName}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngày sinh: </Text>
          <Text>
            {dayjs(studentViewData?.dateOfBirth).format('DD/MM/YYYY')}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Giới tính: </Text>
          <Text>{studentViewData?.gender}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Khóa: </Text>
          <Text>{studentViewData?.course}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngành: </Text>
          <Text>{studentViewData?.major?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Email: </Text>
          <Text>{studentViewData?.email}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số điện thoại: </Text>
          <Text>{studentViewData?.phone}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Quê quán: </Text>
          <Text>{studentViewData?.homeTown}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Danh sách sở thích: </Text>
          <Text>{studentViewData?.hobbyList?.join(', ')}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Trạng thái: </Text>
          <Text>{studentViewData?.status}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewStudentDrawer;
