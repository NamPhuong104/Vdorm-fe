'use client';

import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Access from '../../global/Access';

interface IProps {
  dataSource: IRoomType;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateModal: () => void;
  updateModalPermission: { method: string; apiPath: string; module: string };
  handleDeleteRecord: () => void;
  deleteRecordPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const RoomTypeCard = (props: IProps) => {
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
  const [infrastructureList, setInfrastructureList] = useState<string[]>([]);

  useEffect(() => {
    const infrastructureListClone: string[] = [];
    dataSource.infrastructureList.map((infrastructure: any) => {
      infrastructureListClone.push(infrastructure.name);
    });
    setInfrastructureList(infrastructureListClone);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.name}
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
      <Text ellipsis>
        <Text strong>Danh sách cơ sở vật chất: </Text>
        <Text>{infrastructureList.join(', ')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Sức chứa: </Text>
        <Text>{dataSource?.numberOfStudents}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Số lượng phòng: </Text>
        <Text>{dataSource?.numberOfRooms}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Số lượng còn lại: </Text>
        <Text>{dataSource?.roomTypeRemaining}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Giá (VND): </Text>
        <Text>{currencyFormat(dataSource?.price)}</Text>
      </Text>
    </Card>
  );
};

export default RoomTypeCard;
