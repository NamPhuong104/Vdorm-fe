'use client';

import { Drawer, Typography } from 'antd';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  permissionViewData: null | IPermission;
  setPermissionViewData: (value: null | IPermission) => void;
}

const ViewPermissionDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    permissionViewData,
    setPermissionViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setPermissionViewData(null);
  };

  return (
    <Drawer
      title="Thông tin quyền hạn"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-permission"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Tên: </Text>
          <Text>{permissionViewData?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Đường dẫn: </Text>
          <Text>{permissionViewData?.apiPath}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Phương thức: </Text>
          <Text>{permissionViewData?.method}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Module: </Text>
          <Text>{permissionViewData?.module}</Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewPermissionDrawer;
