'use client';

import { Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  roomTypeViewData: null | IRoomType;
  setRoomTypeViewData: (value: null | IRoomType) => void;
}

const ViewRoomTypeDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    roomTypeViewData,
    setRoomTypeViewData,
  } = props;
  const { Text, Paragraph } = Typography;
  const [infrastructureList, setInfrastructureList] = useState<string[]>([]);

  useEffect(() => {
    if (roomTypeViewData) {
      const infrastructureListClone: string[] = [];
      roomTypeViewData.infrastructureList.map((infrastructure: any) => {
        infrastructureListClone.push(infrastructure.name);
      });
      setInfrastructureList(infrastructureListClone);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypeViewData]);

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setRoomTypeViewData(null);
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Drawer
      title="Thông tin loại phòng"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-room-type"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{roomTypeViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Mã: </Text>
          <Text>{roomTypeViewData?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tên: </Text>
          <Text>{roomTypeViewData?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Danh sách cơ sở vật chất: </Text>
          <Text>{infrastructureList.join(', ')}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Sức chứa: </Text>
          <Text>{roomTypeViewData?.numberOfStudents}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số lượng phòng: </Text>
          <Text>{roomTypeViewData?.numberOfRooms}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số lượng còn lại: </Text>
          <Text>{roomTypeViewData?.roomTypeRemaining}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Giá (VND): </Text>
          <Text>{currencyFormat(roomTypeViewData?.price)}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewRoomTypeDrawer;
