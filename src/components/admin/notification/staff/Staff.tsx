'use client';

import Loading from '@/components/admin/global/Loading';
import SearchInput from '@/components/admin/global/SearchInput';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  Pagination,
  Row,
  Table,
  Typography,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import locale from 'antd/es/date-picker/locale/vi_VN';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import SearchButton from '../../global/SearchButton';
import AppTitle from '../../global/Title';
import NotificationCard from '../card/NotificationCard';
import CreateNotificationModal from '../modal/CreateNotificationModal';
import UpdateNotificationModal from '../modal/UpdateNotificationModal';
import ViewNotificationDrawer from '../modal/ViewNotificationDrawer';

interface IProps {
  permissionList: IPermission[];
}

const Staff = (props: IProps) => {
  const { permissionList } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const [notificationList, setNotificationList] = useState<INotification[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [notificationViewData, setNotificationViewData] =
    useState<null | INotification>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [notificationUpdateData, setNotificationUpdateData] =
    useState<null | INotification>(null);
  const [title, setTitle] = useState<string>('');
  const [publishDate, setPublishDate] = useState<string>('');
  const [sender, setSender] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !title &&
      !publishDate &&
      !sender &&
      permissionList.length
    ) {
      fetchNotificationList(meta.current, meta.pageSize, '-createdAt');
    } else if (status === 'authenticated' && (title || publishDate || sender)) {
      fetchNotificationList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(title, publishDate, sender)),
      );
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
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/notifications?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
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
    } else {
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
    }
  };

  const handleConfirmDeleteNotification = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/notifications/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
      }
      if (title || publishDate || sender) {
        fetchNotificationList(
          meta.current,
          meta.pageSize,
          '-createdAt',
          buildQueryString(queryParams(title, publishDate, sender)),
        );
      } else {
        fetchNotificationList(meta.current, meta.pageSize, '-createdAt');
      }
    } catch (error: any) {
      notification.error({
        message: 'Xóa thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = (modalType: string, value?: INotification) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setNotificationViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setNotificationUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (title: string, publishDate: string, sender: string) => {
    const param: any = {};

    if (title) param.title = title;
    if (publishDate) param.publishDate = publishDate;
    if (sender) param.sender = sender;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.title) query.title = `/${query.title}/i`;
    if (query.publishDate) query.publishDate = `${query.publishDate}`;
    if (query.sender) query.sender = `/${query.sender}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const onChangePublishDate: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      setPublishDate(dayjs(date).format('YYYY-MM-DD'));
    } else setPublishDate('');
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
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.NOTIFICATIONS.PATCH}
            handleDeleteRecord={() =>
              handleConfirmDeleteNotification(record._id)
            }
            deleteRecordPermission={ALL_PERMISSIONS.NOTIFICATIONS.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="notification-page">
      <AppTitle
        moduleName="Thông Báo"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.NOTIFICATIONS.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={8}>
          <SearchInput
            label="Tiêu đề"
            placeholder="Nhập tiêu đề"
            setState={setTitle}
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <SearchInput
            label="Người gửi"
            placeholder="Nhập người gửi"
            setState={setSender}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <Typography.Text>Ngày gửi</Typography.Text>
          <DatePicker
            locale={locale}
            format={'DD/MM/YYYY'}
            placeholder="Chọn ngày gửi"
            style={{ width: '100%' }}
            onChange={onChangePublishDate}
          />
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={2}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() => {
                fetchNotificationList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(title, publishDate, sender)),
                );
              }}
            />
          </Flex>
        </Col>
      </Row>
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
                    handleUpdateModal={() =>
                      handleModal('update', notification)
                    }
                    updateModalPermission={ALL_PERMISSIONS.NOTIFICATIONS.PATCH}
                    handleDeleteRecord={() =>
                      handleConfirmDeleteNotification(notification._id)
                    }
                    deleteRecordPermission={
                      ALL_PERMISSIONS.NOTIFICATIONS.DELETE
                    }
                    permissionList={permissionList}
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
      <CreateNotificationModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchNotificationList={() =>
          fetchNotificationList(meta.current, meta.pageSize, '-createdAt')
        }
      />
      <ViewNotificationDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        notificationViewData={notificationViewData}
        setNotificationViewData={setNotificationViewData}
      />
      <UpdateNotificationModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        notificationUpdateData={notificationUpdateData}
        setNotificationUpdateData={setNotificationUpdateData}
        fetchNotificationList={
          title || publishDate || sender
            ? () =>
                fetchNotificationList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(title, publishDate, sender)),
                )
            : () =>
                fetchNotificationList(meta.current, meta.pageSize, '-createdAt')
        }
      />
    </div>
  );
};

export default Staff;
