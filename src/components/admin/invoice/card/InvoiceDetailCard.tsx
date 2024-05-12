'use client';

import {
  faEye,
  faLightbulb,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Popconfirm, Typography } from 'antd';
import Access from '../../global/Access';

interface IProps {
  dataSource: IInvoiceDetail;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  handleUpdateElectricityModal?: () => void;
  updateElectricityModalPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleUpdateStatusModal?: () => void;
  updateStatusModalPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  isPaid?: boolean;
  haveElectricityNumber?: boolean;
  permissionList: IPermission[];
  role?: string;
}

const InvoiceDetailCard = (props: IProps) => {
  const {
    dataSource,
    handleViewDrawer,
    viewDrawerPermission,
    handleUpdateElectricityModal,
    updateElectricityModalPermission,
    handleUpdateStatusModal,
    updateStatusModalPermission,
    isPaid,
    haveElectricityNumber,
    permissionList,
    role,
  } = props;
  const { Text } = Typography;

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Card
      className="custom-card"
      hoverable
      title={`${dataSource.month}/${dataSource.year}`}
      style={{ minWidth: '200px' }}
      actions={
        dataSource.electricityNumber === false &&
        dataSource.status === 'Chưa thanh toán' &&
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
                permission={updateElectricityModalPermission}
                permissionList={permissionList}
                key="update-electricity"
              >
                <FontAwesomeIcon
                  color="#ffd900"
                  icon={faLightbulb}
                  onClick={
                    !isPaid === true ? handleUpdateElectricityModal : () => {}
                  }
                />
              </Access>,
            ]
          : dataSource.electricityNumber === true &&
            dataSource.status === 'Chưa thanh toán' &&
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
                permission={updateStatusModalPermission}
                permissionList={permissionList}
                key="update-status"
              >
                <Popconfirm
                  title="Bạn có chắc chắn muốn chuyển trạng thái ?"
                  onConfirm={handleUpdateStatusModal}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  placement="left"
                  disabled={
                    (haveElectricityNumber && !isPaid) === true ? false : true
                  }
                >
                  <FontAwesomeIcon color="#ff0000" icon={faPenToSquare} />
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
        <Text strong>Thời gian: </Text>
        <Text>
          {dataSource?.month}/{dataSource?.year}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Tổng tiền (VND): </Text>
        <Text>{currencyFormat(dataSource?.totalAmount)}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Số điện: </Text>
        <Text>
          {dataSource?.electricityNumber === true ? 'Đã ghi' : 'Chưa ghi'}
        </Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
    </Card>
  );
};

export default InvoiceDetailCard;
