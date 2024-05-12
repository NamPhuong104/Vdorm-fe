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
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import SearchInput from '../global/SearchInput';
import StatusLabel from '../global/StatusLabel';
import AppTitle from '../global/Title';
import RoleCard from './card/RoleCard';
import CreateRoleModal from './modal/CreateRoleModal';
import UpdateRoleModal from './modal/UpdateRoleModal';
import ViewRoleDrawer from './modal/ViewRoleDrawer';

const isActiveOptions: { value: string; label: string }[] = [
  {
    value: 'false',
    label: 'Không hoạt động',
  },
  {
    value: 'true',
    label: 'Hoạt động',
  },
];

const Role = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [accountPermissionList, setAccountPermissionList] = useState<
    IPermission[]
  >([]);
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [roleViewData, setRoleViewData] = useState<null | IRole>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [roleUpdateData, setRoleUpdateData] = useState<null | IRole>(null);
  const [name, setName] = useState<string>('');
  const [isActive, setIsActive] = useState<string>('');
  const [permissionListGroupByModule, setPermissionListGroupByModule] =
    useState<
      | {
          module: string;
          permissionList: IPermission[];
        }[]
      | null
    >(null);

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
      fetchPermissionList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !name &&
      !isActive &&
      accountPermissionList.length
    ) {
      fetchRoleList(meta.current, meta.pageSize, '-createdAt');
    } else if (status === 'authenticated' && (name || isActive)) {
      fetchRoleList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(name, isActive)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, accountPermissionList]);

  useEffect(() => {
    if (permissionList) {
      setPermissionListGroupByModule(
        handlePermissionListGroupByModule(permissionList),
      );
    }
  }, [permissionList]);

  useEffect(() => {
    if (roleList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchRoleList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/roles?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setRoleList(res?.data?.data?.result as IRole[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRoleList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/roles?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setRoleList(res?.data?.data?.result as IRole[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRoleList([]);
        setIsLoading(false);
      }
    }
  };

  const fetchPermissionList = async () => {
    try {
      const res = await axiosAuth.get(`/permissions`);
      setPermissionList(res?.data?.data?.result as IPermission[]);
    } catch (error) {
      setPermissionList([]);
    }
  };

  const handleConfirmDeleteRole = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/roles/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (name || isActive) {
          fetchRoleList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(name, isActive)),
          );
        } else {
          fetchRoleList(meta.current, meta.pageSize, '-createdAt');
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

  const handlePermissionListGroupByModule = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissionList: value as IPermission[] };
      })
      .value();
  };

  const handleModal = (modalType: string, value?: IRole) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setRoleViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setRoleUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (name: string, isActive: string) => {
    const param: any = {};

    if (name) param.name = name;
    if (isActive) param.isActive = isActive;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.name) query.name = `/${query.name}/i`;
    if (query.isActive) query.isActive = `/${query.isActive}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IRole> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      width: '25%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <StatusLabel
            data={record.isActive === 'false' ? 'Không hoạt động' : 'Hoạt động'}
            type={record.isActive === 'false' ? 3 : 1}
          />
        );
      },
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
            viewModalPermission={ALL_PERMISSIONS.ROLES.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.ROLES.PATCH}
            handleDeleteRecord={() => handleConfirmDeleteRole(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.ROLES.DELETE}
            permissionList={accountPermissionList}
          />
        );
      },
    },
  ];

  if (!accountPermissionList.length) return <></>;

  return (
    <div className="role-page">
      <AppTitle
        moduleName="Chức Vụ"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.ROLES.POST}
        permissionList={accountPermissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
          <SearchInput label="Tên" placeholder="Nhập tên" setState={setName} />
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={isActiveOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setIsActive(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchRoleList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(name, isActive)),
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
            {roleList.map((role) => {
              return (
                <Col xs={24} sm={12} key={role._id}>
                  <RoleCard
                    dataSource={role}
                    handleViewDrawer={() => handleModal('view', role)}
                    viewDrawerPermission={ALL_PERMISSIONS.ROLES.GET}
                    handleUpdateModal={() => handleModal('update', role)}
                    updateModalPermission={ALL_PERMISSIONS.ROLES.PATCH}
                    handleDeleteRecord={() => handleConfirmDeleteRole(role._id)}
                    deleteRecordPermission={ALL_PERMISSIONS.ROLES.DELETE}
                    permissionList={accountPermissionList}
                  />
                </Col>
              );
            })}
            {roleList.length > 0 && (
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
          dataSource={roleList}
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
      <CreateRoleModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchRoleList={() =>
          fetchRoleList(meta.current, meta.pageSize, '-createdAt')
        }
        isActiveOptions={isActiveOptions}
        permissionListGroupByModule={permissionListGroupByModule}
        screenSize={screenSize}
      />
      <ViewRoleDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        roleViewData={roleViewData}
        setRoleViewData={setRoleViewData}
      />
      <UpdateRoleModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        roleUpdateData={roleUpdateData}
        setRoleUpdateData={setRoleUpdateData}
        fetchRoleList={
          name || isActive
            ? () =>
                fetchRoleList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(name, isActive)),
                )
            : () => fetchRoleList(meta.current, meta.pageSize, '-createdAt')
        }
        isActiveOptions={isActiveOptions}
        permissionListGroupByModule={permissionListGroupByModule}
        screenSize={screenSize}
      />
    </div>
  );
};

export default Role;
