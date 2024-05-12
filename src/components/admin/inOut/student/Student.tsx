'use client';

import Loading from '@/components/admin/global/Loading';
import CheckInOutModal from '@/components/client/global/CheckInOutModal';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  Pagination,
  Row,
  Select,
  Typography,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import SearchButton from '../../global/SearchButton';
import AppTitle from '../../global/Title';
import InOutCard from '../card/InOutCard';
import ViewInOutDrawer from '../modal/ViewInOutDrawer';

interface IProps {
  permissionList: IPermission[];
  typeOptions: { value: string; label: string }[];
}

dayjs.extend(utc);

const Student = (props: IProps) => {
  const { permissionList, typeOptions } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [inOutList, setInOutList] = useState<IInOut[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [inOutViewData, setInOutViewData] = useState<null | IInOut>(null);
  const [type, setType] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [isCheckInOutModalOpen, setIsCheckInOutModalOpen] =
    useState<boolean>(false);
  const [isOnCamera, setIsOnCamera] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated' && !type && !createdAt) {
      fetchInOutList(meta.current, meta.pageSize, '-createdAt');
    } else if (status === 'authenticated' && (type || createdAt)) {
      fetchInOutList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(type, createdAt)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status]);

  useEffect(() => {
    if (inOutList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inOutList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchInOutList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/check-in-out/student?_id=${session?.account?._id}&current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setInOutList(res?.data?.data?.result as IInOut[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInOutList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/check-in-out/student?_id=${session?.account?._id}&current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setInOutList(res?.data?.data?.result as IInOut[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInOutList([]);
        setIsLoading(false);
      }
    }
  };

  const handleModal = (modalType: string, value?: IInOut) => {
    if (modalType === 'view' && value) {
      setInOutViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'in') {
      setCameraType('in');
      setIsOnCamera(true);
      setIsCheckInOutModalOpen(true);
    } else if (modalType === 'out') {
      setCameraType('out');
      setIsOnCamera(true);
      setIsCheckInOutModalOpen(true);
    }
  };

  const queryParams = (type: string, createdAt: string) => {
    const param: any = {};

    if (type) param.type = type;
    if (createdAt) param.createdAt = createdAt;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.type) query.type = `/${query.type}/i`;
    if (query.createdAt) query.createdAt = `${query.createdAt}`;

    return queryString.stringify(query);
  };

  const handleChangeCreatedAt: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      setCreatedAt(dayjs(date).format('YYYY-MM-DD'));
    } else {
      setCreatedAt('');
    }
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IInOut> = [
    {
      title: 'Sinh viên',
      key: 'student',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return `${record.student.code} - ${record.student.fullName}`;
      },
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
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <Typography.Text
            style={{
              padding: '5px 10px',
              backgroundColor: record.type === 'in' ? '#ade3a6' : '#fcbfb6',
              fontWeight: '500',
              borderRadius: '15px',
              boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              textAlign: 'center',
              display: 'inline-block',
              minWidth: '80px',
            }}
          >
            {record.type === 'in' ? 'Vào' : 'Ra'}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return dayjs(record.createdAt)
          .utcOffset(7)
          .format('DD/MM/YYYY - HH:mm:ss');
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.CHECK_IN_OUT.GET_STUDENT}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="in-out-page">
      <AppTitle
        moduleName="Vào/Ra"
        handleCheckIn={() => handleModal('in')}
        checkInPermission={ALL_PERMISSIONS.CHECK_IN_OUT.POST}
        handleCheckOut={() => handleModal('out')}
        checkOutPermission={ALL_PERMISSIONS.CHECK_IN_OUT.POST}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={typeOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setType(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
          <Typography.Text>Thời gian</Typography.Text>
          <DatePicker
            locale={locale}
            format={'DD/MM/YYYY'}
            style={{ width: '100%' }}
            placeholder="Chọn thời gian"
            onChange={handleChangeCreatedAt}
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
                fetchInOutList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(type, createdAt)),
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
            {inOutList.map((inOut) => {
              return (
                <Col xs={24} sm={12} key={inOut._id}>
                  <InOutCard
                    dataSource={inOut}
                    handleViewDrawer={() => handleModal('view', inOut)}
                    viewDrawerPermission={
                      ALL_PERMISSIONS.CHECK_IN_OUT.GET_STUDENT
                    }
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {inOutList.length > 0 && (
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
          dataSource={inOutList}
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
      <ViewInOutDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        inOutViewData={inOutViewData}
        setInOutViewData={setInOutViewData}
      />
      <CheckInOutModal
        isCheckInOutModalOpen={isCheckInOutModalOpen}
        setIsCheckInOutModalOpen={setIsCheckInOutModalOpen}
        isOnCamera={isOnCamera}
        setIsOnCamera={setIsOnCamera}
        cameraType={cameraType}
        fetchInOutList={() =>
          fetchInOutList(meta.current, meta.pageSize, '-createdAt')
        }
      />
    </div>
  );
};

export default Student;
