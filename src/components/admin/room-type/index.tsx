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
  Table,
  Typography,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import SearchInput from '../global/SearchInput';
import AppTitle from '../global/Title';
import RoomTypeCard from './card/RoomTypeCard';
import CreateRoomTypeModal from './modal/CreateRoomTypeModal';
import UpdateRoomTypeModal from './modal/UpdateRoomTypeModal';
import ViewRoomTypeDrawer from './modal/ViewRoomTypeDrawer';

const RoomType = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<IRoomType[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [roomTypeViewData, setRoomTypeViewData] = useState<null | IRoomType>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [roomTypeUpdateData, setRoomTypeUpdateData] =
    useState<null | IRoomType>(null);
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [branchNameOptions, setBranchNameOptions] = useState<
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
      !name &&
      !branchName &&
      permissionList.length
    ) {
      fetchRoomTypeList(meta.current, meta.pageSize, '-createdAt');
    } else if (status === 'authenticated' && (code || name || branchName)) {
      fetchRoomTypeList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(code, name, branchName)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (branchList) {
      const branchNameOptionsClone: { value: string; label: string }[] = [];
      branchList.map((branch: IBranchOption) => {
        branchNameOptionsClone.push({ value: branch.name, label: branch.name });
      });
      setBranchNameOptions(branchNameOptionsClone);
    }
  }, [branchList]);

  useEffect(() => {
    if (roomTypeList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypeList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchRoomTypeList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/room-types?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setRoomTypeList(res?.data?.data?.result as IRoomType[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRoomTypeList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/room-types?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setRoomTypeList(res?.data?.data?.result as IRoomType[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRoomTypeList([]);
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

  const handleConfirmDeleteRoomType = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/room-types/${_id}`);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (code || name || branchName) {
          fetchRoomTypeList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(code, name, branchName)),
          );
        } else {
          fetchRoomTypeList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = (modalType: string, value?: IRoomType) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setRoomTypeViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setRoomTypeUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (code: string, name: string, branchName: string) => {
    const param: any = {};

    if (code) param.code = code;
    if (name) param.name = name;
    if (branchName) param.branchName = branchName;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.name) query.name = `/${query.name}/i`;
    if (query.branchName) query.branchName = `${query.branchName}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IRoomType> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'numberOfStudents',
      key: 'numberOfStudents',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Phòng trống',
      dataIndex: 'roomTypeRemaining',
      key: 'roomTypeRemaining',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return currencyFormat(record.price);
      },
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '15%',
      ellipsis: true,
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
            viewModalPermission={ALL_PERMISSIONS.ROOM_TYPES.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.ROOM_TYPES.PATCH}
            handleDeleteRecord={() => handleConfirmDeleteRoomType(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.ROOM_TYPES.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="room-type-page">
      <AppTitle
        moduleName="Loại Phòng"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.ROOM_TYPES.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={5} xl={6} xxl={7}>
          <SearchInput label="Mã" placeholder="Nhập mã" setState={setCode} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={5} xl={6} xxl={7}>
          <SearchInput label="Tên" placeholder="Nhập tên" setState={setName} />
        </Col>
        <Col xs={24} sm={24} md={8} lg={10} xl={9} xxl={8}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            options={branchNameOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => setBranchName(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={3} xxl={2}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchRoomTypeList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(code, name, branchName)),
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
            {roomTypeList.map((roomType) => {
              return (
                <Col xs={24} sm={12} key={roomType._id}>
                  <RoomTypeCard
                    dataSource={roomType}
                    handleViewDrawer={() => handleModal('view', roomType)}
                    viewDrawerPermission={ALL_PERMISSIONS.ROOM_TYPES.GET}
                    handleUpdateModal={() => handleModal('update', roomType)}
                    updateModalPermission={ALL_PERMISSIONS.ROOM_TYPES.PATCH}
                    handleDeleteRecord={() =>
                      handleConfirmDeleteRoomType(roomType._id)
                    }
                    deleteRecordPermission={ALL_PERMISSIONS.ROOM_TYPES.DELETE}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {roomTypeList.length > 0 && (
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
          dataSource={roomTypeList}
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
      <CreateRoomTypeModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchRoomTypeList={() =>
          fetchRoomTypeList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
      />
      <ViewRoomTypeDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        roomTypeViewData={roomTypeViewData}
        setRoomTypeViewData={setRoomTypeViewData}
      />
      <UpdateRoomTypeModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        roomTypeUpdateData={roomTypeUpdateData}
        setRoomTypeUpdateData={setRoomTypeUpdateData}
        fetchRoomTypeList={
          code || name || branchName
            ? () =>
                fetchRoomTypeList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(code, name, branchName)),
                )
            : () => fetchRoomTypeList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
      />
    </div>
  );
};

export default RoomType;
