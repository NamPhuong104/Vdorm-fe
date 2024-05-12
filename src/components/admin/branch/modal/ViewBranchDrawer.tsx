'use client';

import { Drawer, Typography } from 'antd';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  branchViewData: null | IBranch;
  setBranchViewData: (value: null | IBranch) => void;
}

const ViewBranchDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    branchViewData,
    setBranchViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setBranchViewData(null);
  };

  return (
    <Drawer
      title="Thông tin chi nhánh"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-branch"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Tên: </Text>
          <Text>{branchViewData?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Địa chỉ: </Text>
          <Text>{branchViewData?.address}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Email: </Text>
          <Text>{branchViewData?.email}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Số điện thoại: </Text>
          <Text>{branchViewData?.phone}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewBranchDrawer;
