'use client';

import ActionButtons from '@/components/admin/global/ActionButtons';
import Loading from '@/components/admin/global/Loading';
import SearchButton from '@/components/admin/global/SearchButton';
import SearchInput from '@/components/admin/global/SearchInput';
import AppTitle from '@/components/admin/global/Title';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  DatePicker,
  Flex,
  notification,
  Pagination,
  Row,
  Select,
  Typography,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Table, { ColumnsType } from 'antd/es/table';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import StudentProfileCard from './card/StudentProfileCard';
import ViewStudentProfileDrawer from './modal/ViewStudentProfileDrawer';

const studentProfileStatusOptions = [
  {
    value: 'Đang ở',
    label: 'Đang ở',
  },
  {
    value: 'Ngừng ở',
    label: 'Ngừng ở',
  },
  {
    value: 'Ngừng ở do vi phạm',
    label: 'Ngừng ở do vi phạm',
  },
];

const StudentProfile = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [studentProfileList, setStudentProfileList] = useState<
    IStudentProfile[]
  >([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<IRoomTypeOption[]>([]);
  const [roomList, setRoomList] = useState<IRoomOption[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [studentProfileViewData, setStudentProfileViewData] =
    useState<null | IStudentProfile>(null);
  const [studentCode, setStudentCode] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [studentProfileStatus, setStudentProfileStatus] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [roomTypeOptions, setRoomTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [room, setRoom] = useState<string | null>(null);
  const [roomOptions, setRoomOptions] = useState<
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
      !studentCode &&
      !branch &&
      !roomType &&
      !room &&
      !startTime &&
      !endTime &&
      !studentProfileStatus &&
      permissionList.length
    ) {
      fetchStudentProfileList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (studentCode ||
        branch ||
        roomType ||
        room ||
        startTime ||
        endTime ||
        studentProfileStatus)
    ) {
      fetchStudentProfileList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(
          queryParams(
            studentCode,
            branch,
            roomType ?? '',
            room ?? '',
            startTime,
            endTime,
            studentProfileStatus,
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
    if (status === 'authenticated' && branch && roomType) {
      fetchRoomList(branch, roomType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branch, roomType]);

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
      const roomTypeOptionsClone: { value: string; label: string }[] = [];
      roomTypeList.map((roomType: IRoomTypeOption) => {
        roomTypeOptionsClone.push({
          value: roomType._id,
          label: roomType.name,
        });
      });
      setRoomTypeOptions(roomTypeOptionsClone);
    }
  }, [roomTypeList]);

  useEffect(() => {
    if (roomList) {
      const roomOptionsClone: { value: string; label: string }[] = [];
      roomList.map((room: IRoomOption) => {
        roomOptionsClone.push({
          value: room._id,
          label: room.code,
        });
      });
      setRoomOptions(roomOptionsClone);
    }
  }, [roomList]);

  useEffect(() => {
    if (studentProfileList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentProfileList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchStudentProfileList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/student-profiles?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setStudentProfileList(res?.data?.data?.result as IStudentProfile[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setStudentProfileList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/student-profiles?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setStudentProfileList(res?.data?.data?.result as IStudentProfile[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setStudentProfileList([]);
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

  const fetchRoomTypeList = async (branch: string) => {
    try {
      const res = await axiosAuth.get(`/room-types?branch=${branch}`);
      setRoomTypeList(res?.data?.data?.result as IRoomTypeOption[]);
    } catch (error) {
      setRoomTypeList([]);
    }
  };

  const fetchRoomList = async (branch: string, roomType: string) => {
    try {
      const res = await axiosAuth.get(
        `/rooms?branch=${branch}&roomType=${roomType}`,
      );
      setRoomList(res?.data?.data?.result as IRoomOption[]);
    } catch (error) {
      setRoomList([]);
    }
  };

  const handleReturnRoom = async (_id: string) => {
    try {
      const data = { _id };

      const res = await axiosAuth.patch(`/student-profiles`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        if (
          studentCode ||
          branch ||
          roomType ||
          room ||
          startTime ||
          endTime ||
          studentProfileStatus
        ) {
          fetchStudentProfileList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(
                studentCode,
                branch,
                roomType ?? '',
                room ?? '',
                startTime,
                endTime,
                studentProfileStatus,
              ),
            ),
          );
        } else {
          fetchStudentProfileList(meta.current, meta.pageSize, '-createdAt');
        }
      }
    } catch (error: any) {
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = (modalType: string, value?: IStudentProfile) => {
    if (modalType === 'view' && value) {
      setStudentProfileViewData(value);
      setIsViewDrawerOpen(true);
    }
  };

  const queryParams = (
    studentCode: string,
    branch: string,
    roomType: string,
    room: string,
    startTime: string,
    endTime: string,
    status: string,
  ) => {
    const param: any = {};

    if (studentCode) param.studentCode = studentCode;
    if (branch) param.branch = branch;
    if (roomType) param.roomType = roomType;
    if (room) param.room = room;
    if (startTime) param.startTime = startTime;
    if (endTime) param.endTime = endTime;
    if (status) param.status = status;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.studentCode) query.studentCode = `${query.studentCode}`;
    if (query.branch) query.branch = `${query.branch}`;
    if (query.roomType) query.roomType = `${query.roomType}`;
    if (query.room) query.room = `${query.room}`;
    if (query.startTime) query.startTime = `${query.startTime}`;
    if (query.endTime) query.endTime = `${query.endTime}`;
    if (query.status) query.status = `${query.status}`;

    return queryString.stringify(query);
  };

  const handleStartTime: DatePickerProps['onChange'] = (date, dateString) => {
    if (date != null) {
      setStartTime(dayjs(date).format('YYYY-MM-DD'));
    } else setStartTime('');
  };

  const handleEndTime: DatePickerProps['onChange'] = (date, dateString) => {
    if (date != null) {
      setEndTime(dayjs(date).format('YYYY-MM-DD'));
    } else setEndTime('');
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IStudentProfile> = [
    {
      title: 'Sinh viên',
      key: 'student',
      align: 'center',
      width: '25%',
      ellipsis: true,
      render: (_, record) => {
        return `${record?.student?.code} - ${record?.student?.fullName}`;
      },
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '25%',
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
      title: 'Phòng',
      dataIndex: ['room', 'code'],
      key: 'room',
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
        return record.status === 'Đang ở' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.STUDENT_PROFILES.GET}
            handleReturnRoom={() => handleReturnRoom(record._id)}
            returnRoomPermission={ALL_PERMISSIONS.STUDENT_PROFILES.PATCH}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.STUDENT_PROFILES.GET}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="student-profile-page">
      <AppTitle moduleName="Hồ Sơ Sinh Viên" />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput
            label="Mã số sinh viên"
            placeholder="Nhập mã số sinh viên"
            setState={setStudentCode}
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
              setRoomTypeOptions([]);
              setRoomType(null);
              setRoomOptions([]);
              setRoom(null);
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
            options={roomTypeOptions}
            placeholder="Chọn loại phòng"
            onChange={(value) => {
              setRoomType(value);
              setRoomOptions([]);
              setRoom(null);
            }}
            style={{ width: '100%' }}
            value={roomType}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Phòng</Typography.Text>
          <Select
            allowClear
            options={roomOptions}
            placeholder="Chọn phòng"
            onChange={(value) => setRoom(value)}
            style={{ width: '100%' }}
            value={room}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <Typography.Text>Ngày vào ở</Typography.Text>
          <DatePicker
            locale={locale}
            format={'DD/MM/YYYY'}
            style={{ width: '100%' }}
            placeholder="Chọn ngày vào ở"
            onChange={handleStartTime}
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <Typography.Text>Ngày ngừng ở</Typography.Text>
          <DatePicker
            locale={locale}
            format={'DD/MM/YYYY'}
            style={{ width: '100%' }}
            placeholder="Chọn ngày ngừng ở"
            onChange={handleEndTime}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={studentProfileStatusOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setStudentProfileStatus(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchStudentProfileList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      studentCode,
                      branch,
                      roomType ?? '',
                      room ?? '',
                      startTime,
                      endTime,
                      studentProfileStatus,
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
            {studentProfileList.map((studentProfile) => {
              return (
                <Col xs={24} sm={12} key={studentProfile._id}>
                  <StudentProfileCard
                    dataSource={studentProfile}
                    handleViewDrawer={() => handleModal('view', studentProfile)}
                    viewDrawerPermission={ALL_PERMISSIONS.STUDENT_PROFILES.GET}
                    handleReturnRoom={() =>
                      handleReturnRoom(studentProfile._id)
                    }
                    returnRoomPermission={
                      ALL_PERMISSIONS.STUDENT_PROFILES.PATCH
                    }
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {studentProfileList.length > 0 && (
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
          dataSource={studentProfileList}
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
      <ViewStudentProfileDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        studentProfileViewData={studentProfileViewData}
        setStudentProfileViewData={setStudentProfileViewData}
      />
    </div>
  );
};

export default StudentProfile;
