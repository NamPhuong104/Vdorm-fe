'use client';

import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import numeral from 'numeral';
import Access from '../../global/Access';

interface IProps {
  dataSource: IMaintenance;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleEditModal: () => void;
  editModalPermission: { method: string; apiPath: string; module: string };
  handleDeleteRecord: () => void;
  deleteRecordPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const MaintenanceCards = (props: IProps) => {
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
        <Text strong>Phòng: </Text>
        <Text>{dataSource?.room?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Mã: </Text>
        <Text>{dataSource?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Lý do: </Text>
        <Text>{dataSource?.reason}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Mã cơ sở vật chất: </Text>
        <Text>{dataSource?.infrastructureQrCode?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Tên cơ sở vật chất: </Text>
        <Text>{dataSource?.infrastructureQrCode?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Model: </Text>
        <Text>{dataSource?.infrastructureQrCode?.model}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Chi phí (VND): </Text>
        <Text>{numeral(dataSource?.amountOfMoney).format('0,0')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Đơn vị phụ trách: </Text>
        <Text>{dataSource?.company}</Text>
      </Text>
    </Card>
  );
};

export default MaintenanceCards;
