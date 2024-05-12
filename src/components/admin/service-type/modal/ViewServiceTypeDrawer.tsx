'use client';

import { Drawer, Typography } from 'antd';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  serviceTypeViewData: null | IServiceType;
  setServiceTypeViewData: (value: null | IServiceType) => void;
}

const ViewServiceTypeDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    serviceTypeViewData,
    setServiceTypeViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setServiceTypeViewData(null);
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Drawer
      title="Thông tin loại dịch vụ"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-service-type"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Chi nhánh: </Text>
          <Text>{serviceTypeViewData?.branch?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Mã: </Text>
          <Text>{serviceTypeViewData?.code}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tên: </Text>
          <Text>{serviceTypeViewData?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Giá (VND): </Text>
          <Text>{currencyFormat(serviceTypeViewData?.amountOfMoney)}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Đơn vị: </Text>
          <Text>{serviceTypeViewData?.unit}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewServiceTypeDrawer;
