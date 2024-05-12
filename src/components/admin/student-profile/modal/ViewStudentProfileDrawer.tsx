'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  studentProfileViewData: null | IStudentProfile;
  setStudentProfileViewData: (value: null | IStudentProfile) => void;
}

const ViewStudentProfileDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    studentProfileViewData,
    setStudentProfileViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setStudentProfileViewData(null);
  };

  return (
    <Drawer
      title="Thông tin hồ sơ sinh viên"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-student-profile"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>MSSV: </Text>
          <Text>{studentProfileViewData?.student?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Họ và tên: </Text>
          <Text>{studentProfileViewData?.student?.fullName}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{studentProfileViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Loại phòng: </Text>
          <Text>{studentProfileViewData?.roomType?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Phòng: </Text>
          <Text>{studentProfileViewData?.room?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Ngày vào ở: </Text>
          <Text>
            {dayjs(studentProfileViewData?.startTime).format('DD/MM/YYYY')}
          </Text>
        </Paragraph>
        {studentProfileViewData?.endTime && (
          <Paragraph>
            <Text strong>Ngày ngừng ở: </Text>
            <Text>
              {dayjs(studentProfileViewData?.endTime).format('DD/MM/YYYY')}
            </Text>
          </Paragraph>
        )}
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Trạng thái: </Text>
          <Text>{studentProfileViewData?.status}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewStudentProfileDrawer;
