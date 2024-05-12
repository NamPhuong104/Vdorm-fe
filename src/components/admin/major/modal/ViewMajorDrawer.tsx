'use client';

import { Drawer, Typography } from 'antd';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  majorViewData: null | IMajor;
  setMajorViewData: (value: null | IMajor) => void;
}

const ViewMajorDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    majorViewData,
    setMajorViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setMajorViewData(null);
  };

  return (
    <Drawer
      title="Thông tin ngành"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-major"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Mã: </Text>
          <Text>{majorViewData?.code}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Tên: </Text>
          <Text>{majorViewData?.name}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewMajorDrawer;
