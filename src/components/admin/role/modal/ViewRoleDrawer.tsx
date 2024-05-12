'use client';

import { Drawer, Typography } from 'antd';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  roleViewData: null | IRole;
  setRoleViewData: (value: null | IRole) => void;
}

const ViewRoleDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    roleViewData,
    setRoleViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setRoleViewData(null);
  };

  return (
    <Drawer
      title="Thông tin chức vụ"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-role"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Tên: </Text>
          <Text>{roleViewData?.name}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Mô tả: </Text>
          <Text>{roleViewData?.description}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Text strong>Trạng thái: </Text>
          <Text>
            {roleViewData?.isActive === 'true'
              ? 'Hoạt động'
              : 'Không hoạt động'}
          </Text>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewRoleDrawer;
