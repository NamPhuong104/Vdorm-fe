'use client';

import Loading from '@/components/admin/global/Loading';
import AppTitle from '@/components/admin/global/Title';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Divider, Flex, Pagination, Row, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import ArrangeCard from './card/ArrangeCard';
import ArrangeAutoModal from './modal/ArrangeAutoModal';
import UpdateManyRegistrationModal from './modal/UpdateManyRegistrationModal';
import ViewArrangeDrawer from './modal/ViewArrangeDrawer';

const Arrange = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [arrangeList, setArrangeList] = useState<IRegistration[]>([]);
  const [registrationList, setRegistrationList] = useState<{ _id: string }[]>(
    [],
  );
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [arrangeViewData, setArrangeViewData] = useState<null | IRegistration>(
    null,
  );
  const [
    isUpdateManyRegistrationModalOpen,
    setIsUpdateManyRegistrationModalOpen,
  ] = useState<boolean>(false);
  const [isArrangeAutoModalOpen, setIsArrangeAutoModalOpen] =
    useState<boolean>(false);
  const [isHaveProcessRegistration, setIsHaveProcessRegistration] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session.account.role.name === 'Sinh viên'
    ) {
      redirect('/admin/info');
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'authenticated') {
      const handleGetAccountInfo = async () => {
        try {
          const res: IAxios<IResponsePaginate<IAccount>> = await axiosAuth.get(
            `/auth/account`,
          );

          if (res.data && res.data.message === 'success') {
            setPermissionList(res?.data?.data?.permissionList as IPermission[]);
          }
        } catch (error: any) {
          setPermissionList([]);
        }
      };

      handleGetAccountInfo();
      fetchRegistrationList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchArrangeList(meta.current, meta.pageSize, 'status');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  useEffect(() => {
    if (registrationList.length > 0) {
      setIsHaveProcessRegistration(true);
    } else {
      setIsHaveProcessRegistration(false);
    }
  }, [registrationList]);

  const fetchArrangeList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/registrations?status=arrange&current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setArrangeList(res?.data?.data?.result as IRegistration[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setArrangeList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/registrations?status=arrange&current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setArrangeList(res?.data?.data?.result as IRegistration[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setArrangeList([]);
        setIsLoading(false);
      }
    }
  };

  const fetchRegistrationList = async () => {
    try {
      const res = await axiosAuth.get(`/registrations?status=Đang xử lý`);
      setRegistrationList(res?.data?.data?.result);
    } catch (error) {
      setRegistrationList([]);
    }
  };

  const handleModal = (modalType: string, value?: IRegistration) => {
    if (modalType === 'view' && value) {
      setArrangeViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update-many') {
      setIsUpdateManyRegistrationModalOpen(true);
    } else if (modalType === 'arrange-auto') {
      setIsArrangeAutoModalOpen(true);
    }
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<IRegistration> = [
    {
      title: 'MSSV',
      dataIndex: 'studentCode',
      key: 'studentCode',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Loại phòng',
      dataIndex: ['roomType', 'name'],
      key: 'room',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <Typography.Text
            style={{
              padding: '5px 10px',
              backgroundColor:
                record.status === 'Đang chờ xử lý' ? '#fcbfb6' : '#fceab6',
              fontWeight: '500',
              borderRadius: '15px',
              boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              textAlign: 'center',
              display: 'inline-block',
              minWidth: '100px',
            }}
          >
            {record.status}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_, record) => (
        <ActionButtons
          record={record}
          handleViewModal={() => handleModal('view', record)}
          viewModalPermission={ALL_PERMISSIONS.REGISTRATIONS.GET}
          permissionList={permissionList}
        />
      ),
    },
  ];

  return (
    <div className="arrange-page">
      {!['xs', 'sm'].includes(screenSize) ? (
        <AppTitle
          moduleName="Sắp Xếp Tự Động"
          handleUpdateManyRegistration={() => handleModal('update-many')}
          updateManyRegistrationPermission={
            ALL_PERMISSIONS.REGISTRATIONS.GET_MANY_STATUS
          }
          isDisableArrageAuto={!isHaveProcessRegistration}
          handleArrangeAuto={() => handleModal('arrange-auto')}
          arrangeAutoPermission={ALL_PERMISSIONS.REGISTRATIONS.POST_ARRANGE}
        />
      ) : (
        <AppTitle
          moduleName="Sắp Xếp Tự Động"
          handleUpdateManyRegistration={() => handleModal('update-many')}
          updateManyRegistrationPermission={
            ALL_PERMISSIONS.REGISTRATIONS.GET_MANY_STATUS
          }
        />
      )}
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {arrangeList.map((arrange) => {
              return (
                <Col xs={24} sm={12} key={arrange._id}>
                  <ArrangeCard
                    dataSource={arrange}
                    handleViewDrawer={() => handleModal('view', arrange)}
                    viewDrawerPermission={ALL_PERMISSIONS.REGISTRATIONS.GET}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {arrangeList.length > 0 && (
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
        <>
          <Divider>Danh sách đơn đăng ký</Divider>
          <Table
            columns={columns}
            dataSource={arrangeList}
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
        </>
      )}
      <ViewArrangeDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        arrangeViewData={arrangeViewData}
        setArrangeViewData={setArrangeViewData}
      />
      <UpdateManyRegistrationModal
        isUpdateManyRegistrationModalOpen={isUpdateManyRegistrationModalOpen}
        setIsUpdateManyRegistrationModalOpen={
          setIsUpdateManyRegistrationModalOpen
        }
        fetchArrangeList={() =>
          fetchArrangeList(meta.current, meta.pageSize, 'status')
        }
        fetchRegistrationList={fetchRegistrationList}
      />
      <ArrangeAutoModal
        isArrangeAutoModalOpen={isArrangeAutoModalOpen}
        setIsArrangeAutoModalOpen={setIsArrangeAutoModalOpen}
        fetchArrangeList={() =>
          fetchArrangeList(meta.current, meta.pageSize, 'status')
        }
      />
    </div>
  );
};

export default Arrange;
