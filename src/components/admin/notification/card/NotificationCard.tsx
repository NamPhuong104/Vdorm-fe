'use client';

import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import dayjs from 'dayjs';
import Access from '../../global/Access';

interface IProps {
  dataSource: INotification;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateModal?: () => void;
  updateModalPermission?: { method: string; apiPath: string; module: string };
  handleDeleteRecord?: () => void;
  deleteRecordPermission?: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
  role?: string;
}

const NotificationCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleUpdateModal,
    updateModalPermission,
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
      title={dataSource.title}
      style={{ width: '100%' }}
      actions={
        role !== 'Sinh viên'
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
        <Text strong>Người gửi: </Text>
        <Text>{dataSource?.sender}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Tiêu đề: </Text>
        <Text>{dataSource?.title}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày gửi: </Text>
        <Text>{dayjs(dataSource.publishDate).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Nội dung: </Text>
        <Text>{dataSource?.content}</Text>
      </Text>
    </Card>
  );
};

export default NotificationCard;
