'use client';

import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import Access from '../../global/Access';

interface IProps {
  dataSource: IInfrastructureType;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleEditModal: () => void;
  editModalPermission: { method: string; apiPath: string; module: string };
  handleDeleteRecord: () => void;
  deleteRecordPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const InfrastructureTypesCards = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleEditModal,
    editModalPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    permissionList,
  } = props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.code}
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
          permission={editModalPermission}
          permissionList={permissionList}
          key="update"
        >
          <FontAwesomeIcon
            color="#ffd900"
            icon={faPenToSquare}
            onClick={handleEditModal}
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
        <Text strong>Chi nhánh: </Text>
        <Text>{dataSource?.branch?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Mã: </Text>
        <Text>{dataSource?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Tên: </Text>
        <Text>{dataSource?.name}</Text>
      </Text>
    </Card>
  );
};

export default InfrastructureTypesCards;
