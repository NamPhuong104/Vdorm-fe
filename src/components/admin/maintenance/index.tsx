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
import numeral from 'numeral';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import AppTitle from '../global/Title';
import MaintenanceCards from './card/MaintenanceCard';
import CreateMaintenanceModal from './modal/CreateMaintenanceModal';
import UpdateMaintenanceModal from './modal/UpdateMaintenanceModal';
import ViewMaintenanceDrawer from './modal/ViewMaintenanceDrawer';

const Maintenance = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<IMaintenance[]>([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomList, setRoomList] = useState<IRoomOption[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [maintenanceViewData, setMaintenanceViewData] =
    useState<null | IMaintenance>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [maintenanceUpdateData, setMaintenanceUpdateData] =
    useState<null | IMaintenance>(null);
  const [code, setCode] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomCodeOptions, setRoomCodeOptions] = useState<
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
      !company &&
      !roomCode &&
      !branch &&
      permissionList.length
    ) {
      fetchMaintenanceList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (code || company || branch || roomCode)
    ) {
      fetchMaintenanceList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(code, company, branch, roomCode ?? '')),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (status === 'authenticated' && branch) {
      fetchRoomList(branch);
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
    if (roomList) {
      const roomCodeOptionsClone: { value: string; label: string }[] = [];
      roomList.map((room: IRoomOption) => {
        roomCodeOptionsClone.push({
          value: room.code,
          label: room.code,
        });
      });
      setRoomCodeOptions(roomCodeOptionsClone);
    }
  }, [roomList]);

  useEffect(() => {
    if (maintenanceList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchMaintenanceList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString != '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/maintenances?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setMaintenanceList(res?.data?.data?.result as IMaintenance[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setMaintenanceList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/maintenances?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setMaintenanceList(res?.data?.data?.result as IMaintenance[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setMaintenanceList([]);
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

  const fetchRoomList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(`/rooms?branch=${branchId}`);
      setRoomList(res?.data?.data?.result as IRoomOption[]);
    } catch (error) {
      setRoomList([]);
    }
  };

  const handleDeleteRecord = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/maintenances/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (code || company || branch || roomCode) {
          fetchMaintenanceList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(code, company, branch, roomCode ?? ''),
            ),
          );
        } else {
          fetchMaintenanceList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = (modalType: string, value?: IMaintenance) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setMaintenanceViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setMaintenanceUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (
    code: string,
    company: string,
    branch: string,
    roomCode: string,
  ) => {
    const param: any = {};

    if (code) param.code = code;
    if (company) param.company = company;
    if (branch) param.branch = branch;
    if (roomCode) param.roomCode = roomCode;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.company) query.company = `/${query.company}/i`;
    if (query.branch) query.branch = `${query.branch}`;
    if (query.roomCode) query.roomCode = `${query.roomCode}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IMaintenance> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
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
      title: 'Phòng',
      dataIndex: ['room', 'code'],
      key: 'room',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Chi phí (VND)',
      dataIndex: 'amountOfMoney',
      key: 'amountOfMoney',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return numeral(record.amountOfMoney).format('0,0');
      },
    },
    {
      title: 'Đơn vị phụ trách',
      dataIndex: 'company',
      key: 'company',
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
            viewModalPermission={ALL_PERMISSIONS.MAINTENANCES.PATCH}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.MAINTENANCES.PATCH}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.MAINTENANCES.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="maintenance-page">
      <AppTitle
        moduleName="Đơn Bảo Trì"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.MAINTENANCES.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput label="Mã" placeholder="Nhập mã" setState={setCode} />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Đơn vị phụ trách"
            placeholder="Nhập đơn vị phụ trách"
            setState={setCompany}
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={6}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            style={{ width: '100%' }}
            options={branchOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => {
              setBranch(value);
              setRoomCodeOptions([]);
              setRoomCode(null);
            }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <Typography.Text>Phòng</Typography.Text>
          <Select
            allowClear
            style={{ width: '100%' }}
            options={roomCodeOptions}
            placeholder="Chọn phòng"
            onChange={(value) => {
              setRoomCode(value);
            }}
            value={roomCode}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchMaintenanceList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(code, company, branch, roomCode ?? ''),
                  ),
                )
              }
            />
          </Flex>
        </Col>
      </Row>
      {screenSize == 'xs' || screenSize == 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {maintenanceList.map((maintenance) => {
              return (
                <Col xs={24} sm={12} key={maintenance._id}>
                  <MaintenanceCards
                    dataSource={maintenance}
                    handleViewDrawer={() => handleModal('view', maintenance)}
                    viewDrawerPermission={ALL_PERMISSIONS.MAINTENANCES.GET}
                    handleEditModal={() => handleModal('edit', maintenance)}
                    editModalPermission={ALL_PERMISSIONS.MAINTENANCES.PATCH}
                    handleDeleteRecord={() =>
                      handleDeleteRecord(maintenance._id)
                    }
                    deleteRecordPermission={ALL_PERMISSIONS.MAINTENANCES.DELETE}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {maintenanceList.length > 0 && (
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
          dataSource={maintenanceList}
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
      <CreateMaintenanceModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchMaintenanceList={() =>
          fetchMaintenanceList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
      />
      <ViewMaintenanceDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        maintenanceViewData={maintenanceViewData}
        setMaintenanceViewData={setMaintenanceViewData}
      />
      <UpdateMaintenanceModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        maintenanceUpdateData={maintenanceUpdateData}
        setMaintenanceUpdateData={setMaintenanceUpdateData}
        fetchMaintenanceList={
          code || company || branch || roomCode
            ? () =>
                fetchMaintenanceList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(code, company, branch, roomCode ?? ''),
                  ),
                )
            : () =>
                fetchMaintenanceList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
      />
    </div>
  );
};

export default Maintenance;
