'use client';

import Loading from '@/components/admin/global/Loading';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row, Select, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
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
import UserCard from './card/UserCard';
import UpdateUserModal from './modal/UpdateUserModal';
import ViewUserDrawer from './modal/ViewUserDrawer';

const userStatusOptions: { value: boolean; label: string }[] = [
  {
    value: false,
    label: 'Không hoạt động',
  },
  {
    value: true,
    label: 'Hoạt động',
  },
];

const User = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [roleList, setRoleList] = useState<IRoleOption[]>([]);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [userViewData, setUserViewData] = useState<null | IUser>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [userUpdateData, setUserUpdateData] = useState<null | IUser>(null);
  const [code, setCode] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [userStatus, setUserStatus] = useState<boolean | undefined>();
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([]);

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
      fetchRoleList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !code &&
      !fullName &&
      !role &&
      userStatus === undefined &&
      permissionList.length
    ) {
      fetchUserList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (code || fullName || role || userStatus !== undefined)
    ) {
      fetchUserList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(code, fullName, role, userStatus)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (roleList) {
      const roleOptionsClone: { value: string; label: string }[] = [];
      roleList.map((role: IRoleOption) => {
        roleOptionsClone.push({ value: role.name, label: role.name });
      });
      setRoleOptions(roleOptionsClone);
    }
  }, [roleList]);

  useEffect(() => {
    if (userList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchUserList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/users?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setUserList(res?.data?.data?.result as IUser[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setUserList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/users?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setUserList(res?.data?.data?.result as IUser[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setUserList([]);
        setIsLoading(false);
      }
    }
  };

  const fetchRoleList = async () => {
    try {
      const res = await axiosAuth.get(`/roles`);
      let roleList = res?.data?.data?.result;
      roleList = roleList.filter(
        (role: IRoleOption) => role.name !== 'Sinh viên',
      );
      setRoleList(roleList as IRoleOption[]);
    } catch (error) {
      setRoleList([]);
    }
  };

  const handleModal = (modalType: string, value?: IUser) => {
    if (modalType === 'view' && value) {
      setUserViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setUserUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (
    code: string,
    fullName: string,
    role: string,
    isActive?: boolean,
  ) => {
    const param: any = {};

    if (code) param.code = code;
    if (fullName) param.fullName = fullName;
    if (role) param.role = role;
    if (isActive === true || isActive === false) param.isActive = isActive;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.fullName) query.fullName = `/${query.fullName}/i`;
    if (query.role) query.role = `/${query.role}/i`;
    if (query.isActive) query.isActive = `${query.isActive}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IUser> = [
    {
      title: 'Mã số',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Chức vụ',
      dataIndex: ['role', 'name'],
      key: 'role',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <StatusLabel
            data={record.isActive === false ? 'Không hoạt động' : 'Hoạt động'}
            type={record.isActive === false ? 3 : 1}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_, record) =>
        record.code && record.fullName && record.dateOfBirth && record.phone ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.USERS.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.USERS.POST_NEW}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.USERS.GET}
            permissionList={permissionList}
          />
        ),
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="user-page">
      <AppTitle moduleName="Nhân Viên" />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Mã số"
            placeholder="Nhập mã số"
            setState={setCode}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            setState={setFullName}
          />
        </Col>
        <Col xs={12} sm={12} md={10} lg={5} xl={5} xxl={5}>
          <Typography.Text>Chức vụ</Typography.Text>
          <Select
            allowClear
            options={roleOptions}
            placeholder="Chọn chức vụ"
            onChange={(value) => setRole(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={10} lg={5} xl={5} xxl={5}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={userStatusOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setUserStatus(value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
          <Flex
            style={{
              flexDirection: 'row-reverse',
            }}
          >
            <SearchButton
              onFetch={() =>
                fetchUserList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(code, fullName, role, userStatus),
                  ),
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
            {userList.map((user) => {
              return (
                <Col xs={24} sm={12} key={user._id}>
                  <UserCard
                    key={user._id}
                    dataSource={user}
                    handleViewDrawer={() => handleModal('view', user)}
                    viewDrawerPermission={ALL_PERMISSIONS.USERS.GET}
                    handleUpdateModal={() => handleModal('update', user)}
                    updateModalPermission={ALL_PERMISSIONS.USERS.POST_NEW}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {userList.length > 0 && (
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
          dataSource={userList}
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
      <ViewUserDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        userViewData={userViewData}
        setUserViewData={setUserViewData}
      />
      <UpdateUserModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        userUpdateData={userUpdateData}
        setUserUpdateData={setUserUpdateData}
        fetchUserList={
          code || fullName || role || userStatus !== undefined
            ? () =>
                fetchUserList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(code, fullName, role, userStatus),
                  ),
                )
            : () => fetchUserList(meta.current, meta.pageSize, '-createdAt')
        }
        roleList={roleList}
        userStatusOptions={userStatusOptions}
      />
    </div>
  );
};

export default User;
