'use client';

import Loading from '@/components/admin/global/Loading';
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
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import SearchButton from '../../global/SearchButton';
import SearchInput from '../../global/SearchInput';
import StatusLabel from '../../global/StatusLabel';
import AppTitle from '../../global/Title';
import RegistrationCard from '../card/RegistrationCard';
import CreateRegistrationModal from '../modal/CreateRegistrationModal';
import UpdateRegistrationModal from '../modal/UpdateRegistrationModal';
import ViewRegistrationDrawer from '../modal/ViewRegistrationDrawer';

interface IProps {
  permissionList: IPermission[];
  registrationStatusOptions: { value: string; label: string }[];
  genderOptions: { value: string; label: string }[];
  hobbyOptions: { value: string; label: string }[];
}

const Staff = (props: IProps) => {
  const {
    permissionList,
    registrationStatusOptions,
    genderOptions,
    hobbyOptions,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<IRoomTypeOption[]>([]);
  const [majorList, setMajorList] = useState<IMajorOption[]>([]);
  const [registrationList, setRegistrationList] = useState<IRegistration[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [registrationViewData, setRegistrationViewData] =
    useState<null | IRegistration>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [registrationUpdateData, setRegistrationUpdateData] =
    useState<null | IRegistration>(null);
  const [studentCode, setStudentCode] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [homeTown, setHomeTown] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomTypeName, setRoomTypeName] = useState<string | null>(null);
  const [roomTypeNameOptions, setRoomTypeNameOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBranchList();
      fetchMajorList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !studentCode &&
      !fullName &&
      !homeTown &&
      !registrationStatus &&
      !branch &&
      !roomTypeName &&
      permissionList.length
    ) {
      fetchRegistrationList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (studentCode ||
        fullName ||
        homeTown ||
        registrationStatus ||
        branch ||
        roomTypeName)
    ) {
      fetchRegistrationList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(
          queryParams(
            studentCode,
            fullName,
            homeTown,
            registrationStatus,
            branch,
            roomTypeName ?? '',
          ),
        ),
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
    if (registrationList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchRegistrationList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/registrations?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setRegistrationList(res?.data?.data?.result as IRegistration[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRegistrationList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/registrations?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setRegistrationList(res?.data?.data?.result as IRegistration[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setRegistrationList([]);
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

  const fetchMajorList = async () => {
    try {
      const res = await axiosAuth.get(`/majors`);
      setMajorList(res?.data?.data?.result as IMajorOption[]);
    } catch (error) {
      setMajorList([]);
    }
  };

  const handleChangeRegistrationStatus = async (
    _id: string,
    status: string,
  ) => {
    let data = {};

    if (status === 'Đang xử lý') {
      data = {
        _id,
        status: 'Đang xử lý',
      };
    } else if (status === 'Đã xử lý') {
      data = {
        _id,
        status: 'Đã xử lý',
      };
    } else {
      data = {
        _id,
        status: 'Hết phòng',
      };
    }

    try {
      const res = await axiosAuth.patch(`/registrations/status`, data);
      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        fetchRegistrationList(meta.current, meta.pageSize, '-createdAt');
      }
    } catch (error: any) {
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleConfirmDeleteRegistration = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/registrations/${_id}`);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (
          studentCode ||
          fullName ||
          homeTown ||
          registrationStatus ||
          branch ||
          roomTypeName
        ) {
          fetchRegistrationList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(
                studentCode,
                fullName,
                homeTown,
                registrationStatus,
                branch,
                roomTypeName ?? '',
              ),
            ),
          );
        } else {
          fetchRegistrationList(meta.current, meta.pageSize, '-createdAt');
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

  const handleUploadRegistrationFile = async ({
    file,
    onSuccess,
    onError,
  }: any) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        folder_type: 'registration',
      },
    };
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axiosAuth.post(`/files/registration`, data, config);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Nhập file thành công !',
          duration: 2,
        });
        fetchRegistrationList(meta.current, meta.pageSize, '-createdAt');
      }
    } catch (error: any) {
      notification.error({
        message: 'Nhập file thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = (modalType: string, value?: IRegistration) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setRegistrationViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setRegistrationUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (
    studentCode: string,
    fullName: string,
    homeTown: string,
    status: string,
    branch: string,
    roomTypeName: string,
  ) => {
    const param: any = {};

    if (studentCode) param.studentCode = studentCode;
    if (fullName) param.fullName = fullName;
    if (homeTown) param.homeTown = homeTown;
    if (status) param.status = status;
    if (branch) param.branch = branch;
    if (roomTypeName) param.roomTypeName = roomTypeName;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.studentCode) query.studentCode = `/${query.studentCode}/i`;
    if (query.fullName) query.fullName = `/${query.fullName}/i`;
    if (query.homeTown) query.homeTown = `${query.homeTown}`;
    if (query.status) query.status = `/${query.status}/i`;
    if (query.branch) query.branch = `${query.branch}`;
    if (query.roomTypeName) query.roomTypeName = `${query.roomTypeName}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const handleBeforeUpload = (file: any) => {
    const isXlsx =
      file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isXlsx) {
      notification.error({
        message: 'Nhập đăng ký thất bại !',
        description: 'Vui lòng chọn file excel !',
        duration: 2,
      });
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      notification.error({
        message: 'Nhập đăng ký thất bại !',
        description: 'Vui lòng chọn file có kích thước nhỏ hơn 1MB !',
        duration: 2,
      });
    }
    return isXlsx && isLt1M;
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: ['md', 'lg'].includes(screenSize) ? '0%' : '20%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: ['md', 'lg'].includes(screenSize) ? '30%' : '20%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <StatusLabel
            data={record.status}
            type={
              ['Đang chờ xử lý', 'Hết phòng'].includes(record.status)
                ? 3
                : record.status === 'Đang xử lý'
                ? 2
                : 1
            }
          />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: ['md', 'lg'].includes(screenSize) ? '35%' : '25%',
      render: (record) => {
        return record.status === 'Đang chờ xử lý' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.REGISTRATIONS.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.REGISTRATIONS.PATCH}
            handleProcessingRegistration={() =>
              handleChangeRegistrationStatus(record._id, 'Đang xử lý')
            }
            processingRegistrationPermission={
              ALL_PERMISSIONS.REGISTRATIONS.PATCH_STATUS
            }
            handleDeleteRecord={() =>
              handleConfirmDeleteRegistration(record._id)
            }
            deleteRecordPermission={ALL_PERMISSIONS.REGISTRATIONS.DELETE}
            permissionList={permissionList}
          />
        ) : record.status === 'Đang xử lý' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.REGISTRATIONS.GET}
            handleProcessedRegistration={() =>
              handleChangeRegistrationStatus(record._id, 'Đã xử lý')
            }
            processedRegistrationPermission={
              ALL_PERMISSIONS.REGISTRATIONS.PATCH_STATUS
            }
            handleOutOfRoom={() =>
              handleChangeRegistrationStatus(record._id, 'Hết phòng')
            }
            outOfRoomPermission={ALL_PERMISSIONS.REGISTRATIONS.PATCH_STATUS}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.REGISTRATIONS.GET}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="registraion-page">
      <AppTitle
        moduleName="Đơn Đăng Ký"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.REGISTRATIONS.POST}
        importPermission={ALL_PERMISSIONS.FILES.POST_REGISTRATION}
        handleBeforeUpload={handleBeforeUpload}
        handleUploadFile={handleUploadRegistrationFile}
        exportLink={`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/registration/export`}
        exportPermission={ALL_PERMISSIONS.FILES.GET_REGISTRATION}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput
            label="Mã số sinh viên"
            placeholder="Nhập mã số"
            setState={setStudentCode}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            setState={setFullName}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput
            label="Quê quán"
            placeholder="Nhập quê quán"
            setState={setHomeTown}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={registrationStatusOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setRegistrationStatus(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} xl={11} xxl={11}>
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
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={11}>
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
        <Col xs={24} sm={24} md={4} lg={4} xl={3} xxl={2}>
          <Flex
            style={{
              flexDirection: 'row-reverse',
            }}
          >
            <SearchButton
              onFetch={() =>
                fetchRegistrationList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      studentCode,
                      fullName,
                      homeTown,
                      registrationStatus,
                      branch,
                      roomTypeName ?? '',
                    ),
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
            {registrationList.map((registration) => {
              return (
                <Col xs={24} sm={12} key={registration._id}>
                  <RegistrationCard
                    dataSource={registration}
                    handleViewDrawer={() => handleModal('view', registration)}
                    viewDrawerPermission={ALL_PERMISSIONS.REGISTRATIONS.GET}
                    handleUpdateModal={() =>
                      handleModal('update', registration)
                    }
                    updateModalPermission={ALL_PERMISSIONS.REGISTRATIONS.PATCH}
                    handleProcessingRegistration={() =>
                      handleChangeRegistrationStatus(
                        registration._id,
                        'Đang xử lý',
                      )
                    }
                    processingRegistrationPermission={
                      ALL_PERMISSIONS.REGISTRATIONS.PATCH_STATUS
                    }
                    handleProcessedRegistration={() =>
                      handleChangeRegistrationStatus(
                        registration._id,
                        'Đã xử lý',
                      )
                    }
                    processedRegistrationPermission={
                      ALL_PERMISSIONS.REGISTRATIONS.PATCH_STATUS
                    }
                    handleOutOfRoom={() =>
                      handleChangeRegistrationStatus(
                        registration._id,
                        'Hết phòng',
                      )
                    }
                    outOfRoomPermission={
                      ALL_PERMISSIONS.REGISTRATIONS.PATCH_STATUS
                    }
                    handleDeleteRecord={() =>
                      handleConfirmDeleteRegistration(registration._id)
                    }
                    deleteRecordPermission={
                      ALL_PERMISSIONS.REGISTRATIONS.DELETE
                    }
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {registrationList.length > 0 && (
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
          dataSource={registrationList}
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
      <CreateRegistrationModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchRegistrationList={() =>
          fetchRegistrationList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
        majorList={majorList}
        genderOptions={genderOptions}
        hobbyOptions={hobbyOptions}
      />
      <ViewRegistrationDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        registrationViewData={registrationViewData}
        setRegistrationViewData={setRegistrationViewData}
      />
      <UpdateRegistrationModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        registrationUpdateData={registrationUpdateData}
        setRegistrationUpdateData={setRegistrationUpdateData}
        fetchRegistrationList={
          studentCode ||
          fullName ||
          homeTown ||
          registrationStatus ||
          branch ||
          roomTypeName
            ? () =>
                fetchRegistrationList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      studentCode,
                      fullName,
                      homeTown,
                      registrationStatus,
                      branch,
                      roomTypeName ?? '',
                    ),
                  ),
                )
            : () =>
                fetchRegistrationList(meta.current, meta.pageSize, '-createdAt')
        }
        branchList={branchList}
        majorList={majorList}
        genderOptions={genderOptions}
        hobbyOptions={hobbyOptions}
      />
    </div>
  );
};

export default Staff;
