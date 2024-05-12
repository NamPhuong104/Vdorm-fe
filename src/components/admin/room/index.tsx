'use client';

import Loading from '@/components/admin/global/Loading';
import SearchInput from '@/components/admin/global/SearchInput';
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
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import AppTitle from '../global/Title';
import RoomCard from './card/RoomCards';
import CreateRoomModal from './modal/CreateRoomModal';
import UpdateRoomModal from './modal/UpdateRoomModal';
import UpdateStudentListModal from './modal/UpdateStudentListModal';
import ViewRoomDrawer from './modal/ViewRoomDrawer';

const genderOptions: { value: string; label: string }[] = [
  {
    value: 'Nam',
    label: 'Nam',
  },
  {
    value: 'Nữ',
    label: 'Nữ',
  },
];

const Room = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<IRoomTypeOption[]>([]);
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [roomViewData, setRoomViewData] = useState<null | IRoom>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [roomUpdateData, setRoomUpdateData] = useState<null | IRoom>(null);
  const [isUpdateStudentListModalOpen, setIsUpdateStudentListModalOpen] =
    useState<boolean>(false);
  const [studentListUpdateData, setStudentListUpdateData] =
    useState<null | IRoom>(null);
  const [code, setCode] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [roomTypeName, setRoomTypeName] = useState<string | null>(null);
  const [roomTypeNameOptions, setRoomTypeNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [branch, setBranch] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
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
      fetchBranchList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !code &&
      !gender &&
      !roomTypeName &&
      !branch &&
      permissionList.length
    ) {
      fetchRoomList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (code || gender || roomTypeName || branch)
    ) {
      fetchRoomList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(code, gender, roomTypeName ?? '', branch)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (status === 'authenticated' && branch) {
      fetchRoomTypeList(branch);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branch]);

  useEffect(() => {
    if (branchList) {
      const branchOptionsClone: { value: string; label: string }[] = [];
      branchList.map((branch: IBranchOption) => {
        branchOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchOptions(branchOptionsClone);
    }
  }, [branchList]);

  useEffect(() => {
    if (roomTypeList) {
      const roomTypeNameOptionsClone: { value: string; label: string }[] = [];
      roomTypeList.map((roomType: IRoomTypeOption) => {
        roomTypeNameOptionsClone.push({
          value: roomType.name,
          label: roomType.name,
        });
      });
      setRoomTypeNameOptions(roomTypeNameOptionsClone);
    }
  }, [roomTypeList]);

  useEffect(() => {
    if (roomList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchRoomList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/rooms?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setRoomList(res?.data?.data?.result as IRoom[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRoomList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/rooms?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setRoomList(res?.data?.data?.result as IRoom[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRoomList([]);
        setIsLoading(false);
      }
    }
  };

  const fetchBranchList = async () => {
    try {
      const res = await axiosAuth.get(`/branches`);
      setBranchList(res?.data?.data?.result as IBranchOption[]);
    } catch (error) {
      setBranchList([]);
    }
  };

  const fetchRoomTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/room-types?branch=${branchId}`);
      setRoomTypeList(res?.data?.data?.result as IRoomTypeOption[]);
    } catch (error) {
      setRoomTypeList([]);
    }
  };

  const handleConfirmDeleteRoom = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/rooms/${_id}`);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (code || gender || branch || roomTypeName) {
          fetchRoomList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(code, gender, roomTypeName ?? '', branch),
            ),
          );
        } else {
          fetchRoomList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = (modalType: string, value?: IRoom) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setRoomViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setRoomUpdateData(value);
      setIsUpdateModalOpen(true);
    } else if (modalType === 'update-student-list' && value) {
      setStudentListUpdateData(value);
      setIsUpdateStudentListModalOpen(true);
    }
  };

  const queryParams = (
    code: string,
    gender: string,
    roomTypeName: string,
    branch: string,
  ) => {
    const param: any = {};

    if (code) param.code = code;
    if (gender) param.gender = gender;
    if (roomTypeName) param.roomTypeName = roomTypeName;
    if (branch) param.branch = branch;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.gender) query.gender = `/${query.gender}/i`;
    if (query.roomTypeName) query.roomTypeName = `${query.roomTypeName}`;
    if (query.branch) query.branch = `${query.branch}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IRoom> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Loại phòng',
      dataIndex: ['roomType', 'name'],
      key: 'roomType',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Chỗ trống',
      dataIndex: 'studentRemaining',
      key: 'studentRemaining',
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
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '20%',
      render: (_, record) => {
        return (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.ROOMS.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.ROOMS.PATCH}
            handleUpdateStudentList={() =>
              handleModal('update-student-list', record)
            }
            updateStudentListPermission={ALL_PERMISSIONS.ROOMS.PATCH_STUDENT}
            handleDeleteRecord={() => handleConfirmDeleteRoom(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.ROOMS.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="room-page">
      <AppTitle
        moduleName="Phòng"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.ROOMS.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput label="Mã" placeholder="Nhập mã" setState={setCode} />
        </Col>
        <Col xs={12} sm={12} md={3} lg={3} xl={3} xxl={3}>
          <Typography.Text>Giới tính</Typography.Text>
          <Select
            allowClear
            options={genderOptions}
            placeholder="Chọn giới tính"
            onChange={(value) => setGender(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            options={branchOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => {
              setBranch(value);
              setRoomTypeNameOptions([]);
              setRoomTypeName(null);
            }}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Loại phòng</Typography.Text>
          <Select
            allowClear
            options={roomTypeNameOptions}
            placeholder="Chọn loại phòng"
            onChange={(value) => setRoomTypeName(value)}
            style={{ width: '100%' }}
            value={roomTypeName}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              key="search"
              onFetch={() =>
                fetchRoomList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(code, gender, roomTypeName ?? '', branch),
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
            {roomList.map((room) => {
              return (
                <Col xs={24} sm={12} key={room._id}>
                  <RoomCard
                    dataSource={room}
                    handleViewDrawer={() => handleModal('view', room)}
                    viewDrawerPermission={ALL_PERMISSIONS.ROOMS.GET}
                    handleUpdateModal={() => handleModal('update', room)}
                    updateModalPermission={ALL_PERMISSIONS.ROOMS.PATCH}
                    handleUpdateStudentListModal={() =>
                      handleModal('update-student-list', room)
                    }
                    updateStudentListPermission={
                      ALL_PERMISSIONS.ROOMS.PATCH_STUDENT
                    }
                    handleDeleteRecord={() => handleConfirmDeleteRoom(room._id)}
                    deleteRecordPermission={ALL_PERMISSIONS.ROOMS.DELETE}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {roomList.length > 0 && (
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
          dataSource={roomList}
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
      <CreateRoomModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchRoomList={() =>
          fetchRoomList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
        genderOptions={genderOptions}
      />
      <ViewRoomDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        roomViewData={roomViewData}
        setRoomViewData={setRoomViewData}
      />
      <UpdateRoomModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        roomUpdateData={roomUpdateData}
        setRoomUpdateData={setRoomUpdateData}
        fetchRoomList={() =>
          fetchRoomList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
        genderOptions={genderOptions}
      />
      <UpdateStudentListModal
        isUpdateStudentListModalOpen={isUpdateStudentListModalOpen}
        setIsUpdateStudentListModalOpen={setIsUpdateStudentListModalOpen}
        studentListUpdateData={studentListUpdateData}
        setStudentListUpdateData={setStudentListUpdateData}
        fetchRoomList={
          code || gender || branch || roomTypeName
            ? () =>
                fetchRoomList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(code, gender, roomTypeName ?? '', branch),
                  ),
                )
            : () => fetchRoomList(meta.current, meta.pageSize, '-createdAt')
        }
      />
    </div>
  );
};

export default Room;
