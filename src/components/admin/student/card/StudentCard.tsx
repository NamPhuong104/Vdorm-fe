'use client';

import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Typography } from 'antd';
import dayjs from 'dayjs';
import Access from '../../global/Access';

interface IProps {
  dataSource: IStudent;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const StudentCard = (props: IProps) => {
  const { dataSource, handleViewDrawer, viewDrawerPermission, permissionList } =
    props;
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
      ]}
    >
      <Text ellipsis>
        <Text strong>MSSV: </Text>
        <Text>{dataSource?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Họ và tên: </Text>
        <Text>{dataSource?.fullName}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày sinh: </Text>
        <Text>{dayjs(dataSource?.dateOfBirth).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Giới tính: </Text>
        <Text>{dataSource?.gender}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Khóa: </Text>
        <Text>{dataSource?.course}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngành: </Text>
        <Text>{dataSource?.major?.name}</Text>
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
        <Text strong>Quê quán: </Text>
        <Text>{dataSource?.homeTown}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Danh sách sở thích: </Text>
        <Text>{dataSource?.hobbyList?.join(', ')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
    </Card>
  );
};

export default StudentCard;
