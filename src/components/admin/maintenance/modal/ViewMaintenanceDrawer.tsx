'use client';

import { Drawer, Typography } from 'antd';
import numeral from 'numeral';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  maintenanceViewData: null | IMaintenance;
  setMaintenanceViewData: (value: null | IMaintenance) => void;
}

const ViewMaintenanceDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    maintenanceViewData,
    setMaintenanceViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setMaintenanceViewData(null);
  };

  return (
    <Drawer
      title="Thông tin đơn bảo trì"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-maintenance"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{maintenanceViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Phòng: </Text>
          <Text>{maintenanceViewData?.room?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Mã: </Text>
          <Text>{maintenanceViewData?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Lý do: </Text>
          <Text>{maintenanceViewData?.reason}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Mã cơ sở vật chất: </Text>
          <Text>{maintenanceViewData?.infrastructureQrCode?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tên cơ sở vật chất: </Text>
          <Text>{maintenanceViewData?.infrastructureQrCode?.name}</Text>
        </Paragraph>
        {maintenanceViewData?.infrastructureQrCode?.model && (
          <Paragraph>
            <Text strong>Model: </Text>
            <Text>{maintenanceViewData?.infrastructureQrCode?.model}</Text>
          </Paragraph>
        )}
        <Paragraph>
          <Text strong>Chi phí (VND): </Text>
          <Text>
            {numeral(maintenanceViewData?.amountOfMoney).format('0,0')}
          </Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Đơn vị phụ trách: </Text>
          <Text>{maintenanceViewData?.company}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewMaintenanceDrawer;
