'use client';

import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Flex, Popconfirm, Typography } from 'antd';
import Access from '../../global/Access';

interface IProps {
  dataSource: IPermission;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateModal: () => void;
  updateModalPermission: { method: string; apiPath: string; module: string };
  handleDeleteRecord: () => void;
  deleteRecordPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const PermissionCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleUpdateModal,
    updateModalPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    permissionList,
  } = props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={
        <Flex justify="space-between" align="center">
          <p>{dataSource.name}</p>
          <p
            style={{
              fontWeight: 'bold',
              color:
                dataSource.method === 'GET'
                  ? 'green'
                  : dataSource.method === 'POST'
                  ? '#ffd900'
                  : dataSource.method === 'PATCH'
                  ? 'purple'
                  : 'red',
            }}
          >
            {dataSource.method}
          </p>
        </Flex>
      }
      style={{ width: '100%' }}
      actions={[
        <Access
          hideChildren
          permission={viewDrawerPermission}
          permissionList={permissionList}
          key="view"
        >
          <FontAwesomeIcon
            color="#448026"
            icon={faEye}
            onClick={handleViewDrawer}
          />
        </Access>,
        <Access
          hideChildren
          permission={updateModalPermission}
          permissionList={permissionList}
          key="update"
        >
          <FontAwesomeIcon
            color="#ffd900"
            icon={faPenToSquare}
            onClick={handleUpdateModal}
          />
        </Access>,
        <Access
          hideChildren
          permission={deleteRecordPermission}
          permissionList={permissionList}
          key="delete"
        >
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ?"
            onConfirm={handleDeleteRecord}
            okText="Xóa"
            cancelText="Hủy"
            placement="left"
          >
            <FontAwesomeIcon color="#ff0000" icon={faTrashCan} />
          </Popconfirm>
        </Access>,
      ]}
    >
      <Text ellipsis>
        <Text strong>Tên: </Text>
        <Text>{dataSource?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Đường dẫn: </Text>
        <Text>{dataSource?.apiPath}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Phương thức: </Text>
        <Text>{dataSource?.method}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Module: </Text>
        <Text>{dataSource?.module}</Text>
      </Text>
    </Card>
  );
};

export default PermissionCard;
