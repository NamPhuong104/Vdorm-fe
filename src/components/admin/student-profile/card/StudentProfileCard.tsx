'use client';

import { faEye, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Access from '../../global/Access';

interface IProps {
  dataSource: IStudentProfile;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleReturnRoom: () => void;
  returnRoomPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const StudentProfileCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleReturnRoom,
    returnRoomPermission,
    permissionList,
  } = props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.student.code}
      style={{ width: '100%' }}
      actions={
        dataSource.status === 'Đang ở'
          ? [
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
                permission={returnRoomPermission}
                permissionList={permissionList}
                key="return-room"
              >
                <Popconfirm
                  title="Chuyển trạng thái thành ngừng ở ?"
                  onConfirm={handleReturnRoom}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#ff0d0d" icon={faUserMinus} />
                </Popconfirm>
              </Access>,
            ]
          : [
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
            ]
      }
    >
      <Text ellipsis>
        <Text strong>MSSV: </Text>
        <Text>{dataSource?.student?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Họ và tên: </Text>
        <Text>{dataSource?.student?.fullName}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Chi nhánh: </Text>
        <Text>{dataSource?.branch?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Loại phòng: </Text>
        <Text>{dataSource?.roomType?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Phòng: </Text>
        <Text>{dataSource?.room?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày vào ở: </Text>
        <Text>{dayjs(dataSource?.startTime).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày ngừng ở: </Text>
        <Text>
          {dataSource?.endTime
            ? dayjs(dataSource?.startTime).format('DD/MM/YYYY')
            : ''}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
    </Card>
  );
};

export default StudentProfileCard;
