'use client';

import {
  faEye,
  faPenToSquare,
  faTrashCan,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Access from '../../global/Access';

interface IProps {
  dataSource: IRoom;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateModal: () => void;
  updateModalPermission: { method: string; apiPath: string; module: string };
  handleUpdateStudentListModal: () => void;
  updateStudentListPermission: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleDeleteRecord: () => void;
  deleteRecordPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const RoomCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleUpdateModal,
    updateModalPermission,
    handleUpdateStudentListModal,
    updateStudentListPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    permissionList,
  } = props;
  const { Text } = Typography;
  const [serviceTypeList, setServiceTypeList] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<string[]>([]);

  useEffect(() => {
    const serviceTypeListClone: string[] = [];
    const studentListClone: string[] = [];

    dataSource.serviceTypeList.map(
      (serviceType: { _id: string; name: string }) => {
        serviceTypeListClone.push(serviceType.name);
      },
    );

    dataSource.studentList.map(
      (student: { _id: string; code: string; fullName: string }) => {
        studentListClone.push(`${student.code} - ${student.fullName}`);
      },
    );

    setServiceTypeList(serviceTypeListClone);
    setStudentList(studentListClone);
  }, [dataSource]);

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
          permission={updateStudentListPermission}
          permissionList={permissionList}
          key="update-student-list"
        >
          <FontAwesomeIcon
            color="#0d7bba"
            icon={faUserPlus}
            onClick={handleUpdateStudentListModal}
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
        <Text strong>Loại phòng: </Text>
        <Text>{dataSource?.roomType?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Danh sách dịch vụ: </Text>
        <Text>{serviceTypeList.join(', ')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Mã: </Text>
        <Text>{dataSource?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Giới tính: </Text>
        <Text>{dataSource?.gender}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Chỗ trống: </Text>
        <Text>{dataSource?.studentRemaining}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Danh sách sinh viên: </Text>
        <Text>{studentList.join(', ')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Chủ phòng: </Text>
        {dataSource?.roomOwner.length > 0 && (
          <Text>{`${dataSource?.roomOwner[0]?.code} - ${dataSource?.roomOwner[0]?.fullName}`}</Text>
        )}
      </Text>
      <Text ellipsis>
        <Text strong>Hợp đồng: </Text>
        <Text>{dataSource?.hasContract === true ? 'Đã tạo' : 'Chưa tạo'}</Text>
      </Text>
    </Card>
  );
};

export default RoomCard;
