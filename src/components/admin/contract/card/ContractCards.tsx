'use client';

import Access from '@/components/admin/global/Access';
import StatusLabel from '@/components/admin/global/StatusLabel';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faBan,
  faEye,
  faFilePdf,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Flex, Popconfirm, Typography } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  dataSource: IContract;
  handleViewRecord: () => void;
  viewRecordPermission: { method: string; apiPath: string; module: string };
  handleEditRecord?: () => void;
  editRecordPermission?: { method: string; apiPath: string; module: string };
  handleDeleteRecord?: () => void;
  deleteRecordPermission?: { method: string; apiPath: string; module: string };
  handleExportRecord: () => void;
  exportRecordPermission: { method: string; apiPath: string; module: string };
  handleSignContract?: () => void;
  signContractPermission?: { method: string; apiPath: string; module: string };
  handleTerminateContract?: () => void;
  terminateContractPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  permissionList: IPermission[];
  role?: string;
}

const ContractCards = (props: IProps) => {
  const {
    dataSource,
    handleViewRecord,
    viewRecordPermission,
    handleEditRecord,
    editRecordPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    handleExportRecord,
    exportRecordPermission,
    handleSignContract,
    signContractPermission,
    handleTerminateContract,
    terminateContractPermission,
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
              width: '65%',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <p style={{ fontSize: '15px' }}>{dataSource.code}</p>
          </div>
          <StatusLabel
            data={dataSource.status}
            type={
              dataSource.status === 'Đã ký'
                ? 1
                : dataSource.status === 'Mới tạo'
                ? 2
                : 3
            }
          />
        </Flex>
      }
      actions={
        dataSource.status === 'Mới tạo' && role !== 'Sinh viên'
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
                permission={exportRecordPermission}
                permissionList={permissionList}
                key="export"
              >
                <FontAwesomeIcon
                  color="#0d7bba"
                  icon={faFilePdf}
                  onClick={handleExportRecord}
                />
              </Access>,
              <Access
                hideChildren
                permission={editRecordPermission}
                permissionList={permissionList}
                key="update"
              >
                <FontAwesomeIcon
                  color="#e3ba5b"
                  icon={faPenToSquare}
                  onClick={handleEditRecord}
                />
              </Access>,
              <Access
                hideChildren
                permission={signContractPermission}
                permissionList={permissionList}
                key="sign"
              >
                <Popconfirm
                  title="Đã ký hợp đồng ?"
                  onConfirm={handleSignContract}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#ff8a0d" icon={faSignature} />
                </Popconfirm>
              </Access>,
              <Access
                hideChildren
                permission={deleteRecordPermission}
                permissionList={permissionList}
                key="delete"
              >
                <Popconfirm
                  title="Xóa hợp đồng"
                  onConfirm={handleDeleteRecord}
                  okText="Xóa"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="red" icon={faTrashCan} />
                </Popconfirm>
              </Access>,
            ]
          : dataSource.status === 'Đã ký' && role !== 'Sinh viên'
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
                permission={exportRecordPermission}
                permissionList={permissionList}
                key="export"
              >
                <FontAwesomeIcon
                  color="#0d7bba"
                  icon={faFilePdf}
                  onClick={handleExportRecord}
                />
              </Access>,
              <Access
                hideChildren
                permission={terminateContractPermission}
                permissionList={permissionList}
                key="terminate"
              >
                <Popconfirm
                  title="Chấm dứt hợp đồng ?"
                  onConfirm={handleTerminateContract}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                >
                  <FontAwesomeIcon color="#ff0d0d" icon={faBan} />
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
                permission={exportRecordPermission}
                permissionList={permissionList}
                key="export"
              >
                <FontAwesomeIcon
                  color="#0d7bba"
                  icon={faFilePdf}
                  onClick={handleExportRecord}
                />
              </Access>,
            ]
      }
    >
      <Text ellipsis>
        <Text strong>Mã: </Text>
        <Text>{dataSource?.code}</Text>
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
        <Text strong>Sinh viên: </Text>
        <Text>
          {`${dataSource?.student?.code} - ${dataSource?.student?.fullName}`}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày tạo: </Text>
        <Text>{dayjs(dataSource?.createdDate).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày vào ở: </Text>
        <Text>{dayjs(dataSource?.startDate).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày ngừng ở: </Text>
        <Text>{dayjs(dataSource?.endDate).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Tình trạng: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.duration}</Text>
      </Text>
    </Card>
  );
};

export default ContractCards;
