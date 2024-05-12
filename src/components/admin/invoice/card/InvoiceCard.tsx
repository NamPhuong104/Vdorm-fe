'use client';

import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Typography } from 'antd';
import Access from '../../global/Access';

interface IProps {
  dataSource: IInvoice;
  handleViewModal: () => void;
  viewModalPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const InvoiceCard = (props: IProps) => {
  const { dataSource, handleViewModal, viewModalPermission, permissionList } =
    props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.room.code}
      style={{ width: '100%' }}
      actions={[
        <Access
          hideChildren
          permission={viewModalPermission}
          permissionList={permissionList}
          key="view"
        >
          <FontAwesomeIcon
            color="#448026"
            icon={faEye}
            onClick={handleViewModal}
          />
        </Access>,
      ]}
    >
      <Text ellipsis>
        <Text strong>Chi nhánh: </Text>
        <Text>{dataSource?.branch?.name}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Phòng: </Text>
        <Text>{dataSource?.room?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.status}</Text>
      </Text>
    </Card>
  );
};

export default InvoiceCard;
