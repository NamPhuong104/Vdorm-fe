'use client';

import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Typography } from 'antd';
import dayjs from 'dayjs';
import Access from '../../global/Access';

interface IProps {
  dataSource: IUser;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateModal: () => void;
  updateModalPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const UserCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleUpdateModal,
    updateModalPermission,
    permissionList,
  } = props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.fullName}
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
      ]}
    >
      <Text ellipsis>
        <Text strong>Mã số: </Text>
        <Text>{dataSource?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Họ và tên: </Text>
        <Text>{dataSource?.fullName}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày sinh: </Text>
        <Text>
          {dataSource?.dateOfBirth
            ? dayjs(dataSource?.dateOfBirth).format('DD/MM/YYYY')
            : ''}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Email: </Text>
        <Text>{dataSource?.email}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Số điện thoại: </Text>
        <Text>{dataSource?.phone}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Chức vụ: </Text>
        <Text>{dataSource?.role?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>
          {dataSource?.isActive === false ? 'Không hoạt động' : 'Hoạt động'}
        </Text>
      </Text>
    </Card>
  );
};

export default UserCard;
