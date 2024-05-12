'use client';

import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Typography } from 'antd';
import dayjs from 'dayjs';
import Access from '../../global/Access';

interface IProps {
  dataSource: INew;
  handleViewModal: () => void;
  viewModalPermission: { method: string; apiPath: string; module: string };
  permissionList: IPermission[];
}

const NewsCard = (props: IProps) => {
  const { dataSource, handleViewModal, viewModalPermission, permissionList } =
    props;
  const { Text } = Typography;

  return (
    <Card
      className="custom-card"
      hoverable
      title={dataSource.title}
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
        <Text strong>Tiêu đề: </Text>
        <Text>{dataSource?.title}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Danh mục: </Text>
        <Text>{dataSource?.category}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Tác giả: </Text>
        <Text>{dataSource?.author}</Text>
      </Text>
      <Text ellipsis>
        <Text strong>Ngày đăng: </Text>
        <Text>{dayjs(dataSource.publishDate).format('DD/MM/YYYY')}</Text>
      </Text>
    </Card>
  );
};

export default NewsCard;
