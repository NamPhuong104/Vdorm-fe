'use client';

import Loading from '@/components/admin/global/Loading';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import AppTitle from '../../global/Title';
import NotificationCard from '../card/NotificationCard';
import ViewNotificationDrawer from '../modal/ViewNotificationDrawer';

interface IProps {
  permissionList: IPermission[];
}

const Student = (props: IProps) => {
  const { permissionList } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [notificationList, setNotificationList] = useState<INotification[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [notificationViewData, setNotificationViewData] =
    useState<null | INotification>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchNotificationList(meta.current, meta.pageSize, '-createdAt');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (notificationList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({
          ...prevMeta,
          current: prevMeta.current - 1,
        }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchNotificationList = async (
    current: number,
    pageSize: number,
    sort: string,
  ) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(
        `/notifications?current=${current}&pageSize=${pageSize}&sort=${sort}`,
      );
      setNotificationList(res?.data?.data?.result as INotification[]);
      setMeta({
        current: res?.data?.data?.meta?.current,
        pageSize: res?.data?.data?.meta?.pageSize,
        pages: res?.data?.data?.meta?.pages,
        total: res?.data?.data?.meta?.total,
      });
      setIsLoading(false);
    } catch (error: any) {
      setNotificationList([]);
      setIsLoading(false);
    }
  };

  const handleModal = (modalType: string, value?: INotification) => {
    if (modalType === 'view' && value) {
      setNotificationViewData(value);
      setIsViewDrawerOpen(true);
    }
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<INotification> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      key: 'sender',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'publishDate',
      key: 'publishDate',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return dayjs(record.publishDate).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      width: '30%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'left' }}>
            <span>{record.content}</span>
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_, record) => {
        return (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.NOTIFICATIONS.GET}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="notification-page">
      <AppTitle moduleName="Thông Báo" />
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {notificationList.map((notification) => {
              return (
                <Col xs={24} sm={12} key={notification._id}>
                  <NotificationCard
                    dataSource={notification}
                    handleViewDrawer={() => handleModal('view', notification)}
                    viewDrawerPermission={ALL_PERMISSIONS.NOTIFICATIONS.GET}
                    permissionList={permissionList}
                    role="Sinh viên"
                  />
                </Col>
              );
            })}
            {notificationList.length > 0 && (
              <Col span={24}>
                <Flex justify="flex-end">
                  <Pagination
                    simple={screenSize === 'xs' ? true : false}
                    size="small"
                    locale={{ items_per_page: '/ trang' }}
                    current={meta.current}
                    pageSize={meta.pageSize}
                    total={meta.total}
                    showTotal={
                      screenSize === 'sm'
                        ? (total, range) => `${range[0]}-${range[1]} / ${total}`
                        : undefined
                    }
                    onChange={(page: number, pageSize: number) => {
                      handleChangePage(page, pageSize);
                    }}
                    pageSizeOptions={[10, 20, 30, 40, 50]}
                    showSizeChanger={screenSize === 'sm' ? true : false}
                    style={{ display: 'inline-block' }}
                  />
                </Flex>
              </Col>
            )}
          </Row>
        )
      ) : (
        <Table
          columns={columns}
          dataSource={notificationList}
          rowKey={'_id'}
          loading={isLoading}
          pagination={{
            locale: { items_per_page: '/ trang' },
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
            onChange: (page: number, pageSize: number) =>
              handleChangePage(page, pageSize),
            pageSizeOptions: [10, 20, 30, 40, 50],
            showSizeChanger: true,
          }}
          style={{ padding: '0px 3px' }}
        />
      )}
      <ViewNotificationDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        notificationViewData={notificationViewData}
        setNotificationViewData={setNotificationViewData}
      />
    </div>
  );
};

export default Student;
