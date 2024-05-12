'use client';

import Loading from '@/components/admin/global/Loading';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  Flex,
  Pagination,
  Row,
  Select,
  Typography,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import SearchInput from '../global/SearchInput';
import AppTitle from '../global/Title';
import PermissionCard from './card/PermissionCard';
import CreatePermissionModal from './modal/CreatePermissionModal';
import UpdatePermissionModal from './modal/UpdatePermissionModal';
import ViewPermissionDrawer from './modal/ViewPermissionDrawer';

const methodOptions: { value: string; label: string }[] = [
  {
    value: 'GET',
    label: 'GET',
  },
  {
    value: 'POST',
    label: 'POST',
  },
  {
    value: 'PATCH',
    label: 'PATCH',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
];

const Permission = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [accountPermissionList, setAccountPermissionList] = useState<
    IPermission[]
  >([]);
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [permissionViewData, setPermissionViewData] =
    useState<null | IPermission>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [permissionUpdateData, setPermissionUpdateData] =
    useState<null | IPermission>(null);
  const [name, setName] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [module, setModule] = useState<string>('');

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
            setAccountPermissionList(
              res?.data?.data?.permissionList as IPermission[],
            );
          }
        } catch (error: any) {
          setAccountPermissionList([]);
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
      !method &&
      !module &&
      accountPermissionList.length
    ) {
      fetchPermissionList(meta.current, meta.pageSize, '-createdAt');
    } else if (status === 'authenticated' && (name || method || module)) {
      fetchPermissionList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(name, method, module)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, accountPermissionList]);

  useEffect(() => {
    if (permissionList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchPermissionList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/permissions?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setPermissionList(res?.data?.data?.result as IPermission[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setPermissionList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/permissions?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setPermissionList(res?.data?.data?.result as IPermission[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setPermissionList([]);
        setIsLoading(false);
      }
    }
  };

  const handleConfirmDeletePermission = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/permissions/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (name || method || module) {
          fetchPermissionList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(name, method, module)),
          );
        } else {
          fetchPermissionList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = (modalType: string, value?: IPermission) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setPermissionViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setPermissionUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (name: string, method: string, module: string) => {
    const param: any = {};

    if (name) param.name = name;
    if (method) param.method = method;
    if (module) param.module = module;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.name) query.name = `/${query.name}/i`;
    if (query.method) query.method = `/${query.method}/i`;
    if (query.module) query.module = `/${query.module}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IPermission> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'apiPath',
      key: 'apiPath',
      align: 'center',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <span
            style={{
              fontWeight: 'bold',
              color:
                record.method === 'GET'
                  ? 'green'
                  : record.method === 'POST'
                  ? '#ffd900'
                  : record.method === 'PATCH'
                  ? 'purple'
                  : 'red',
            }}
          >
            {record.method}
          </span>
        );
      },
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
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
            viewModalPermission={ALL_PERMISSIONS.PERMISSIONS.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.PERMISSIONS.PATCH}
            handleDeleteRecord={() => handleConfirmDeletePermission(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.PERMISSIONS.DELETE}
            permissionList={accountPermissionList}
          />
        );
      },
    },
  ];

  if (!accountPermissionList.length) return <></>;

  return (
    <div className="permission-page">
      <AppTitle
        moduleName="Quyền Hạn"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.PERMISSIONS.POST}
        permissionList={accountPermissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <SearchInput label="Tên" placeholder="Nhập tên" setState={setName} />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <Typography.Text>Phương thức</Typography.Text>
          <Select
            allowClear
            options={methodOptions}
            placeholder="Chọn phương thức"
            onChange={(value) => setMethod(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <SearchInput
            label="Module"
            placeholder="Nhập module"
            setState={setModule}
          />
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchPermissionList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(name, method, module)),
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
            {permissionList.map((permission) => {
              return (
                <Col xs={24} sm={12} key={permission._id}>
                  <PermissionCard
                    key={permission._id}
                    handleViewDrawer={() => handleModal('view', permission)}
                    viewDrawerPermission={ALL_PERMISSIONS.PERMISSIONS.GET}
                    dataSource={permission}
                    handleUpdateModal={() => handleModal('update', permission)}
                    updateModalPermission={ALL_PERMISSIONS.PERMISSIONS.PATCH}
                    handleDeleteRecord={() =>
                      handleConfirmDeletePermission(permission._id)
                    }
                    deleteRecordPermission={ALL_PERMISSIONS.PERMISSIONS.DELETE}
                    permissionList={accountPermissionList}
                  />
                </Col>
              );
            })}
            {permissionList.length > 0 && (
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
          dataSource={permissionList}
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
      <CreatePermissionModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchPermissionList={() =>
          fetchPermissionList(meta.current, meta.pageSize, '-createdAt')
        }
        methodOptions={methodOptions}
      />
      <ViewPermissionDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        permissionViewData={permissionViewData}
        setPermissionViewData={setPermissionViewData}
      />
      <UpdatePermissionModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        permissionUpdateData={permissionUpdateData}
        setPermissionUpdateData={setPermissionUpdateData}
        fetchPermissionList={
          name || method || module
            ? () =>
                fetchPermissionList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(name, method, module)),
                )
            : () =>
                fetchPermissionList(meta.current, meta.pageSize, '-createdAt')
        }
        methodOptions={methodOptions}
      />
    </div>
  );
};

export default Permission;
