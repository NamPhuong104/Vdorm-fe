'use client';

import ActionButtons from '@/components/admin/global/ActionButtons';
import Loading from '@/components/admin/global/Loading';
import SearchButton from '@/components/admin/global/SearchButton';
import SearchInput from '@/components/admin/global/SearchInput';
import AppTitle from '@/components/admin/global/Title';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row, notification } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import BranchCard from './card/BranchCard';
import CreateBranchModal from './modal/CreateBranchModal';
import UpdateBranchModal from './modal/UpdateBranchModal';
import ViewBranchDrawer from './modal/ViewBranchDrawer';

const Branch = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [branchList, setBranchList] = useState<IBranch[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [branchViewData, setBranchViewData] = useState<null | IBranch>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [branchUpdateData, setBranchUpdateData] = useState<null | IBranch>(
    null,
  );
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !name &&
      !address &&
      !email &&
      !phone &&
      permissionList.length
    ) {
      fetchBranchList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (name || address || email || phone)
    ) {
      fetchBranchList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(name, address, email, phone)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (branchList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchBranchList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/branches?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setBranchList(res?.data?.data?.result as IBranch[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setBranchList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/branches?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setBranchList(res?.data?.data?.result as IBranch[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setBranchList([]);
        setIsLoading(false);
      }
    }
  };

  const handleConfirmDeleteBranch = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/branches/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (name || address || email || phone) {
          fetchBranchList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(name, address, email, phone)),
          );
        } else {
          fetchBranchList(meta.current, meta.pageSize, '-createdAt');
        }
      }
    } catch (error: any) {
      notification.error({
        message: 'Xóa thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = (modalType: string, value?: IBranch) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setBranchViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setBranchUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (
    name: string,
    address: string,
    email: string,
    phone: string,
  ) => {
    const param: any = {};

    if (name) param.name = name;
    if (address) param.address = address;
    if (email) param.email = email;
    if (phone) param.phone = phone;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.name) query.name = `/${query.name}/i`;
    if (query.address) query.address = `/${query.address}/i`;
    if (query.email) query.email = `/${query.email}/i`;
    if (query.phone) query.phone = `/${query.phone}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<IBranch> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      align: 'center',
      render: (_, record) => {
        return (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.BRANCHES.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.BRANCHES.PATCH}
            handleDeleteRecord={() => handleConfirmDeleteBranch(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.BRANCHES.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="branch-page">
      <AppTitle
        moduleName="Chi Nhánh"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.BRANCHES.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput label="Tên" placeholder="Nhập tên" setState={setName} />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            setState={setAddress}
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Email"
            placeholder="Nhập email"
            setState={setEmail}
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            setState={setPhone}
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchBranchList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(name, address, email, phone)),
                )
              }
            />
          </Flex>
        </Col>
      </Row>
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {branchList.map((branch) => {
              return (
                <Col xs={24} sm={12} key={branch._id}>
                  <BranchCard
                    dataSource={branch}
                    handleViewDrawer={() => handleModal('view', branch)}
                    viewDrawerPermission={ALL_PERMISSIONS.BRANCHES.GET}
                    handleUpdateModal={() => handleModal('update', branch)}
                    updateModalPermission={ALL_PERMISSIONS.BRANCHES.PATCH}
                    handleDeleteRecord={() =>
                      handleConfirmDeleteBranch(branch._id)
                    }
                    deleteRecordPermission={ALL_PERMISSIONS.BRANCHES.DELETE}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {branchList.length > 0 && (
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
          dataSource={branchList}
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
      <CreateBranchModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchBranchList={() =>
          fetchBranchList(meta.current, meta.pageSize, '-createdAt')
        }
      />
      <ViewBranchDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        branchViewData={branchViewData}
        setBranchViewData={setBranchViewData}
      />
      <UpdateBranchModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        branchUpdateData={branchUpdateData}
        setBranchUpdateData={setBranchUpdateData}
        fetchBranchList={
          name || address || email || phone
            ? () =>
                fetchBranchList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(name, address, email, phone)),
                )
            : () => fetchBranchList(meta.current, meta.pageSize, '-createdAt')
        }
      />
    </div>
  );
};

export default Branch;
