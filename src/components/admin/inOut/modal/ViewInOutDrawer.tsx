'use client';

import { Drawer, Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  inOutViewData: null | IInOut;
  setInOutViewData: (value: null | IInOut) => void;
}

const ViewInOutDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    inOutViewData,
    setInOutViewData,
  } = props;
  const { Text, Paragraph } = Typography;
  dayjs.extend(utc);

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setInOutViewData(null);
  };

  return (
    <Drawer
      title="Thông tin vào/ra"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-in-out"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>MSSV: </Text>
          <Text>{inOutViewData?.student?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Họ và tên: </Text>
          <Text>{inOutViewData?.student?.fullName}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{inOutViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Phòng: </Text>
          <Text>{inOutViewData?.room?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Trạng thái: </Text>
          <Text>{inOutViewData?.type === 'in' ? 'Vào' : 'Ra'}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Thời gian: </Text>
          <Text>
            {dayjs(inOutViewData?.createdAt)
              .utcOffset(7)
              .format('DD/MM/YYYY - HH:mm:ss')}
          </Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewInOutDrawer;
