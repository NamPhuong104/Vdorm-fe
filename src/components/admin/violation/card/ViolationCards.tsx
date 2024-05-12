'use client';

import StatusLabel from '@/components/admin/global/StatusLabel';
import {
  faCheck,
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Flex, Popconfirm, Typography } from 'antd';
import dayjs from 'dayjs';
import Access from '../../global/Access';

interface IProps {
  dataSource: IViolation;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleEditModal?: () => void;
  editModalPermission?: { method: string; apiPath: string; module: string };
  handleUpdateStatus?: () => void;
  updateStatusPermission?: { method: string; apiPath: string; module: string };
  handleDeleteRecord?: () => void;
  deleteRecordPermission?: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
  role?: string;
}

const ViolationCards = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleEditModal,
    editModalPermission,
    handleUpdateStatus,
    updateStatusPermission,
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
      title={
        <Flex justify="space-between" align="center">
          <div
            style={{
              width: '50%',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <p>{dataSource.reason}</p>
          </div>
          <StatusLabel
            data={dataSource.status}
            type={dataSource.status === 'Đã xử lý' ? 1 : 3}
          />
        </Flex>
      }
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
                permission={updateStatusPermission}
                permissionList={permissionList}
                key="update-status"
              >
                <Popconfirm
                  title={`Chuyển trạng thái thành "Đã xử lý" ?`}
                  onConfirm={handleUpdateStatus}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#ff0d0d" icon={faCheck} />
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
          : dataSource.status === 'Đã xử lý' && role !== 'Sinh viên'
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
        <Text strong>Chi nhánh: </Text>
        <Text>{dataSource?.branch?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Lý do: </Text>
        <Text>{dataSource?.reason}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ghi chú: </Text>
        <Text>{dataSource?.note}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Thời gian vi phạm: </Text>
        <Text>
          {dayjs(dataSource?.dateOfViolation).format('DD/MM/YYYY - HH:mm')}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Mức độ: </Text>
        <Text>{dataSource?.level}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Người phụ trách: </Text>
        <Text>
          {dataSource?.handler &&
            `${dataSource.handler.code} - ${dataSource.handler.fullName}`}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Danh sách sinh viên: </Text>
        <Text>
          {dataSource.studentList
            ?.map((student) => {
              return `${student.code} - ${student.fullName}`;
            })
            .join(', ')}
        </Text>
      </Text>
    </Card>
  );
};

export default ViolationCards;
