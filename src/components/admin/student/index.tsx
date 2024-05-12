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
import AppTitle from '../global/Title';
import StudentCard from './card/StudentCard';
import ViewStudentDrawer from './modal/ViewStudentDrawer';

const studentStatusOptions: { value: string; label: string }[] = [
  {
    value: 'Chưa xếp phòng',
    label: 'Chưa xếp phòng',
  },
  {
    value: 'Đã xếp phòng',
    label: 'Đã xếp phòng',
  },
];

const Student = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [majorList, setMajorList] = useState<IMajorOption[]>([]);
  const [studentList, setStudentList] = useState<IStudent[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [studentViewData, setStudentViewData] = useState<null | IStudent>(null);
  const [code, setCode] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [studentStatus, setStudentStatus] = useState<string>('');
  const [homeTown, setHomeTown] = useState<string>('');
  const [majorName, setMajorName] = useState<string>('');
  const [majorNameOptions, setMajorNameOptions] = useState<
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
      fetchMajorList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !code &&
      !fullName &&
      !majorName &&
      !studentStatus &&
      !homeTown &&
      permissionList.length
    ) {
      fetchStudentList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (code || fullName || majorName || studentStatus || homeTown)
    ) {
      fetchStudentList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(
          queryParams(code, fullName, majorName, studentStatus, homeTown),
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (majorList) {
      const majorListOptionsClone: { value: string; label: string }[] = [];
      majorList.map((major: IMajorOption) => {
        majorListOptionsClone.push({ value: major.name, label: major.name });
      });
      setMajorNameOptions(majorListOptionsClone);
    }
  }, [majorList]);

  useEffect(() => {
    if (studentList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchStudentList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/students?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setStudentList(res?.data?.data?.result as IStudent[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setStudentList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/students?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setStudentList(res?.data?.data?.result as IStudent[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setStudentList([]);
        setIsLoading(false);
      }
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

  const handleModal = (modalType: string, value?: IStudent) => {
    if (modalType === 'view' && value) {
      setStudentViewData(value);
      setIsViewDrawerOpen(true);
    }
  };

  const queryParams = (
    code: string,
    fullName: string,
    majorName: string,
    status: string,
    homeTown: string,
  ) => {
    const param: any = {};

    if (code) param.code = code;
    if (fullName) param.fullName = fullName;
    if (majorName) param.majorName = majorName;
    if (status) param.status = status;
    if (homeTown) param.homeTown = homeTown;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.fullName) query.fullName = `/${query.fullName}/i`;
    if (query.majorName) query.majorName = `${query.majorName}`;
    if (query.status) query.status = `/${query.status}/i`;
    if (query.homeTown) query.homeTown = `/${query.homeTown}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IStudent> = [
    {
      title: 'MSSV',
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
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Khóa',
      dataIndex: 'course',
      key: 'course',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Ngành',
      dataIndex: ['major', 'name'],
      key: 'major',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (record) => {
        return (
          <ActionButtons
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.STUDENTS.GET}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="student-page">
      <AppTitle moduleName="Sinh Viên" />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={8} lg={4} xl={4} xxl={4}>
          <SearchInput
            label="Mã số sinh viên"
            placeholder="Nhập mã số sinh viên"
            setState={setCode}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={5} xxl={5}>
          <SearchInput
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            setState={setFullName}
          />
        </Col>
        <Col xs={12} sm={8} md={8} lg={4} xl={4} xxl={4}>
          <Typography.Text>Ngành</Typography.Text>
          <Select
            allowClear
            options={majorNameOptions}
            placeholder="Chọn ngành"
            onChange={(value) => setMajorName(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={8} md={10} lg={4} xl={4} xxl={4}>
          <SearchInput
            label="Quê quán"
            placeholder="Nhập quê quán"
            setState={setHomeTown}
          />
        </Col>
        <Col xs={12} sm={8} md={10} lg={4} xl={4} xxl={4}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={studentStatusOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setStudentStatus(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={24} md={4} lg={4} xl={3} xxl={3}>
          <Flex
            style={{
              flexDirection: 'row-reverse',
            }}
          >
            <SearchButton
              onFetch={() =>
                fetchStudentList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      code,
                      fullName,
                      majorName,
                      studentStatus,
                      homeTown,
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
            {studentList.map((student) => {
              return (
                <Col xs={24} sm={12} key={student._id}>
                  <StudentCard
                    dataSource={student}
                    handleViewDrawer={() => handleModal('view', student)}
                    viewDrawerPermission={ALL_PERMISSIONS.STUDENTS.GET}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {studentList.length > 0 && (
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
          dataSource={studentList}
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
      <ViewStudentDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        studentViewData={studentViewData}
        setStudentViewData={setStudentViewData}
      />
    </div>
  );
};

export default Student;
