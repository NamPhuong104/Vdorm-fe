'use client';

import {
  faBan,
  faCheck,
  faEye,
  faGear,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import dayjs from 'dayjs';
import Access from '../../global/Access';

interface IProps {
  dataSource: IRegistration;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateModal?: () => void;
  updateModalPermission?: { method: string; apiPath: string; module: string };
  handleProcessingRegistration?: () => void;
  processingRegistrationPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleProcessedRegistration?: () => void;
  processedRegistrationPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleOutOfRoom?: () => void;
  outOfRoomPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleDeleteRecord?: () => void;
  deleteRecordPermission?: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
  role?: string;
}

const RegistrationCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleUpdateModal,
    updateModalPermission,
    handleProcessingRegistration,
    processingRegistrationPermission,
    handleProcessedRegistration,
    processedRegistrationPermission,
    handleOutOfRoom,
    outOfRoomPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    permissionList,
    role,
  } = props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.fullName}
      style={{ width: '100%' }}
      actions={
        dataSource.status === 'Đang chờ xử lý' && role !== 'Sinh viên'
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
                permission={processingRegistrationPermission}
                permissionList={permissionList}
                key="processing"
              >
                <Popconfirm
                  title="Chuyển trạng thái thành 'Đang xử lý' ?"
                  onConfirm={handleProcessingRegistration}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#ff8a0d" icon={faGear} />
                </Popconfirm>
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
            ]
          : dataSource.status === 'Đang xử lý' && role !== 'Sinh viên'
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
                permission={processedRegistrationPermission}
                permissionList={permissionList}
                key="processed"
              >
                <Popconfirm
                  title="Chuyển trạng thái thành 'Đã xử lý' ?"
                  onConfirm={handleProcessedRegistration}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#5BB3E3" icon={faCheck} />
                </Popconfirm>
              </Access>,
              <Access
                hideChildren
                permission={outOfRoomPermission}
                permissionList={permissionList}
                key="out"
              >
                <Popconfirm
                  title="Chuyển trạng thái thành 'Hết phòng' ?"
                  onConfirm={handleOutOfRoom}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#ff0d0d" icon={faBan} />
                </Popconfirm>
              </Access>,
            ]
          : dataSource.status === 'Đang chờ xử lý' && role === 'Sinh viên'
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
        <Text strong>Mã số sinh viên: </Text>
        <Text>{dataSource?.studentCode}</Text>
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
        <Text strong>Chi nhánh: </Text>
        <Text>{dataSource?.branch?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Loại phòng: </Text>
        <Text>{dataSource?.roomType?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
    </Card>
  );
};

export default RegistrationCard;
