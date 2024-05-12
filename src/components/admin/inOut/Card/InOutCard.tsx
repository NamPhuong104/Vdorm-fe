'use client';

import StatusLabel from '@/components/admin/global/StatusLabel';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Access from '../../global/Access';

interface IProps {
  dataSource: IInOut;
  handleViewDrawer: () => void;
  viewDrawerPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

dayjs.extend(utc);

const InOutCard = (props: IProps) => {
  const { dataSource, handleViewDrawer, viewDrawerPermission, permissionList } =
    props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={
        <Flex justify="space-between" align="center">
          <p>{dataSource?.student?.code}</p>
          <StatusLabel
            data={dataSource.type === 'in' ? 'Vào' : 'Ra'}
            type={dataSource.type === 'in' ? 1 : 3}
          />
        </Flex>
      }
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
        <Text strong>Phòng: </Text>
        <Text>{dataSource?.room?.code}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Trạng thái: </Text>
        <Text>{dataSource?.type === 'in' ? 'Vào' : 'Ra'}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Thời gian: </Text>
        <Text>
          {dayjs(dataSource?.createdAt)
            .utcOffset(7)
            .format('DD/MM/YYYY - HH:mm:ss')}
        </Text>
      </Text>
    </Card>
  );
};

export default InOutCard;
