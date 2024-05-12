'use client';

import StatusLabel from '@/components/admin/global/StatusLabel';
import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Flex, Popconfirm, Typography } from 'antd';
import Access from '../../global/Access';

interface IProps {
  dataSource: IContact;
  handleViewRecord: () => void;
  viewRecordPermission: { method: string; apiPath: string; module: string };
  handleEditRecord: () => void;
  editRecordPermission: { method: string; apiPath: string; module: string };
  handleDeleteRecord: () => void;
  deleteRecordPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const ContactCards = (props: IProps) => {
  const {
    dataSource,
    handleViewRecord,
    viewRecordPermission,
    handleEditRecord,
    editRecordPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    permissionList,
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
              width: '65%',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <p style={{ fontSize: '15px' }}>{dataSource.fullName}</p>
          </div>
          <StatusLabel
            data={dataSource.status}
            type={
              dataSource.status === 'Chưa trả lời'
                ? 3
                : dataSource.status === 'Đang trả lời'
                ? 2
                : 1
            }
          />
        </Flex>
      }
      actions={
        dataSource.status !== 'Đã trả lời'
          ? [
              <Access
                hideChildren
                permission={viewRecordPermission}
                permissionList={permissionList}
                key="view"
              >
                <FontAwesomeIcon
                  color="#448026"
                  icon={faEye}
                  onClick={handleViewRecord}
                />
              </Access>,
              <Access
                hideChildren
                permission={editRecordPermission}
                permissionList={permissionList}
                key="update"
              >
                <FontAwesomeIcon
                  color="#ffd900"
                  icon={faPenToSquare}
                  onClick={handleEditRecord}
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
                permission={viewRecordPermission}
                permissionList={permissionList}
                key="view"
              >
                <FontAwesomeIcon
                  color="#448026"
                  icon={faEye}
                  onClick={handleViewRecord}
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
      }
    >
      <Text ellipsis>
        <Text strong>Họ và tên: </Text>
        <Text>{dataSource?.fullName}</Text>
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
        <Text strong>Câu hỏi: </Text>
        <Text>{dataSource?.content}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Câu trả lời: </Text>
        <Text>{dataSource?.replyContent}</Text>
      </Text>
    </Card>
  );
};

export default ContactCards;
