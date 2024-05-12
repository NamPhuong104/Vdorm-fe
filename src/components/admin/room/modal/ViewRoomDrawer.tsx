'use client';

import { Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  roomViewData: null | IRoom;
  setRoomViewData: (value: null | IRoom) => void;
}

const ViewRoomDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    roomViewData,
    setRoomViewData,
  } = props;
  const { Text, Paragraph } = Typography;
  const [serviceTypeList, setServiceTypeList] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<string[]>([]);

  useEffect(() => {
    if (roomViewData) {
      const serviceTypeListClone: string[] = [];
      const studentListClone: string[] = [];

      roomViewData.serviceTypeList.map(
        (serviceType: { _id: string; name: string }) => {
          serviceTypeListClone.push(serviceType.name);
        },
      );

      roomViewData.studentList.map(
        (student: { _id: string; code: string; fullName: string }) => {
          studentListClone.push(`${student.code} - ${student.fullName}`);
        },
      );

      setServiceTypeList(serviceTypeListClone);
      setStudentList(studentListClone);
    }
  }, [roomViewData]);

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setRoomViewData(null);
  };

  return (
    <Drawer
      title="Thông tin phòng"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-room"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{roomViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Loại phòng: </Text>
          <Text>{roomViewData?.roomType?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Danh sách dịch vụ: </Text>
          <Text>{serviceTypeList.join(', ')}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Mã: </Text>
          <Text>{roomViewData?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Giới tính: </Text>
          <Text>{roomViewData?.gender}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Chỗ trống: </Text>
          <Text>{roomViewData?.studentRemaining}</Text>
        </Paragraph>
        {studentList.length > 0 && (
          <Paragraph>
            <Text strong>Danh sách sinh viên: </Text>
            <Text>{studentList.join(', ')}</Text>
          </Paragraph>
        )}
        {roomViewData?.roomOwner[0] && (
          <Paragraph>
            <Text strong>Chủ phòng: </Text>
            <Text>{`${roomViewData?.roomOwner[0]?.code} - ${roomViewData?.roomOwner[0]?.fullName}`}</Text>
          </Paragraph>
        )}
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Hợp đồng: </Text>
          <Text>
            {roomViewData?.hasContract === true ? 'Đã tạo' : 'Chưa tạo'}
          </Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewRoomDrawer;
