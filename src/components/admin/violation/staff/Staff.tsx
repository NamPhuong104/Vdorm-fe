'use client';

import Loading from '@/components/admin/global/Loading';
import SearchInput from '@/components/admin/global/SearchInput';
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
  notification,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import SearchButton from '../../global/SearchButton';
import AppTitle from '../../global/Title';
import ViolationCards from '../card/ViolationCards';
import ViolationModal from '../modal/ViolationModal';

interface IProps {
  permissionList: IPermission[];
  violationLevelOptions: { value: string; label: string }[];
  violationStatusOptions: { value: string; label: string }[];
}

dayjs.extend(utc);

const Staff = (props: IProps) => {
  const { permissionList, violationLevelOptions, violationStatusOptions } =
    props;
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(true);
  const [violationList, setViolationList] = useState<IViolation[]>([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [handlerList, setHandlerList] = useState<IUserOption[]>([]);
  const [modalType, setModalType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [violationUpdateData, setViolationUpdateData] =
    useState<null | IViolation>(null);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [reason, setReason] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [violationStatus, setViolationStatus] = useState<string>('');
  const [handlerName, setHandlerName] = useState<string>('');
  const [dateOfViolation, setDateOfViolation] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
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
      fetchUserList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !reason &&
      !dateOfViolation &&
      !level &&
      !violationStatus &&
      !handlerName &&
      !branchName &&
      permissionList.length
    ) {
      fetchViolationList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (reason ||
        dateOfViolation ||
        level ||
        violationStatus ||
        handlerName ||
        branchName)
    ) {
      fetchViolationList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(
          queryParams(
            branchName,
            reason,
            dateOfViolation,
            level,
            violationStatus,
            handlerName,
          ),
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

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
    if (violationList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violationList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchViolationList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setLoading(true);
        const res = await axiosAuth.get(
          `/violations?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setViolationList(res?.data?.data?.result as IViolation[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setLoading(false);
      } catch (error: any) {
        setViolationList([]);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await axiosAuth.get(
          `/violations?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setViolationList(res?.data?.data?.result as IViolation[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setLoading(false);
      } catch (error) {
        setViolationList([]);
        setLoading(false);
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

  const fetchUserList = async () => {
    try {
      const res = await axiosAuth.get(`/users`);
      setHandlerList(res?.data?.data?.result as IUserOption[]);
    } catch (error) {
      setHandlerList([]);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleDeleteRecord = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/violations/${_id}`);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (
          reason ||
          dateOfViolation ||
          level ||
          violationStatus ||
          handlerName ||
          branchName
        ) {
          fetchViolationList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(
                branchName,
                reason,
                dateOfViolation,
                level,
                violationStatus,
                handlerName,
              ),
            ),
          );
        } else {
          fetchViolationList(meta.current, meta.pageSize, '-createdAt');
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

  const handleUpdateStatus = async (_id: string) => {
    const data = {
      _id,
      status: 'Đã xử lý',
    };

    try {
      const res = await axiosAuth.patch(`/violations/status`, data);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        if (
          reason ||
          dateOfViolation ||
          level ||
          violationStatus ||
          handlerName ||
          branchName
        ) {
          fetchViolationList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(
                branchName,
                reason,
                dateOfViolation,
                level,
                violationStatus,
                handlerName,
              ),
            ),
          );
        } else {
          fetchViolationList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = (modalType: string, value?: IViolation) => {
    if (modalType === 'add') {
      setModalType('add');
      setIsModalOpen(true);
    } else if (modalType === 'view' && value) {
      setModalType('view');
      setIsModalOpen(true);
      setViolationUpdateData(value);
    } else if (modalType === 'edit' && value) {
      setModalType('edit');
      setIsModalOpen(true);
      setViolationUpdateData(value);
    }
  };

  const queryParams = (
    branchName: string,
    reason?: string,
    dateOfViolation?: string,
    level?: string,
    violationStatus?: string,
    handlerName?: string,
  ) => {
    const param: any = {};

    if (reason) param.reason = reason;
    if (dateOfViolation) param.dateOfViolation = dateOfViolation;
    if (level) param.level = level;
    if (violationStatus) param.status = violationStatus;
    if (handlerName) param.handlerName = handlerName;
    if (branchName) param.branchName = branchName;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.reason) query.reason = `/${query.reason}/i`;
    if (query.dateOfViolation)
      query.dateOfViolation = `${query.dateOfViolation}`;
    if (query.level) query.level = `/${query.level}/i`;
    if (query.status) query.status = `/${query.status}/i`;
    if (query.handlerName) query.handlerName = `${query.handlerName}`;
    if (query.branchName) query.branchName = `${query.branchName}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const handleDateOfViolation: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      setDateOfViolation(dayjs(date).format('YYYY-MM-DD'));
    } else setDateOfViolation('');
  };

  const columns: ColumnsType<IViolation> = [
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'left' }}>
            <Typography.Text ellipsis>{record.reason}</Typography.Text>
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'dateOfViolation',
      key: 'dateOfViolation',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return dayjs(record.dateOfViolation)
          .utcOffset(0)
          .format('DD/MM/YYYY - HH:mm');
      },
    },
    {
      title: 'Mức độ',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <Typography.Text
            style={{
              padding: '5px 10px',
              backgroundColor:
                record.status === 'Đã xử lý' ? '#ade3a6' : '#fcbfb6',
              fontWeight: '500',
              borderRadius: '15px',
              boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              textAlign: 'center',
              display: 'inline-block',
              minWidth: '120px',
            }}
          >
            {record.status}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '20%',
      render: (_, record) => {
        return record.status === 'Đang chờ xử lý' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.VIOLATIONS.GET}
            handleEditModal={() => handleModal('edit', record)}
            editModalPermission={ALL_PERMISSIONS.VIOLATIONS.PATCH}
            handleUpdateStatus={() => handleUpdateStatus(record._id)}
            updateStatusPermission={ALL_PERMISSIONS.VIOLATIONS.PATCH_STATUS}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.VIOLATIONS.DELETE}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.VIOLATIONS.GET}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.VIOLATIONS.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="violation-page">
      <AppTitle
        moduleName="Vi Phạm"
        handleAddNew={() => handleModal('add')}
        addNewPermission={ALL_PERMISSIONS.VIOLATIONS.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput
            label="Lý do"
            placeholder="Nhập lý do"
            setState={setReason}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Thời gian</Typography.Text>
          <DatePicker
            format={'DD/MM/YYYY'}
            style={{ width: '100%' }}
            placeholder="Chọn thời gian"
            onChange={handleDateOfViolation}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Mức độ</Typography.Text>
          <Select
            allowClear
            options={violationLevelOptions}
            style={{ width: '100%' }}
            placeholder="Chọn mức độ"
            onClear={() => setLevel('')}
            onSelect={(e) => setLevel(e)}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={violationStatusOptions}
            style={{ width: '100%' }}
            placeholder="Chọn trạng thái"
            onClear={() => setViolationStatus('')}
            onSelect={(e) => setViolationStatus(e)}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
          <SearchInput
            label="Người phụ trách"
            placeholder="Nhập người phụ trách"
            setState={setHandlerName}
          />
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            labelInValue
            options={branchOptions}
            style={{ width: '100%' }}
            placeholder="Chọn chi nhánh"
            onClear={() => setBranchName('')}
            onSelect={(e: { value: string; label: string }) =>
              setBranchName(e.label)
            }
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchViolationList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      branchName,
                      reason,
                      dateOfViolation,
                      level,
                      violationStatus,
                      handlerName,
                    ),
                  ),
                )
              }
            />
          </Flex>
        </Col>
      </Row>
      {screenSize == 'xs' || screenSize == 'sm' ? (
        loading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {violationList.map((violation) => {
              return (
                <Col xs={24} sm={12} key={violation._id}>
                  <ViolationCards
                    dataSource={violation}
                    handleViewDrawer={() => handleModal('view', violation)}
                    viewDrawerPermission={ALL_PERMISSIONS.VIOLATIONS.GET}
                    handleEditModal={() => handleModal('edit', violation)}
                    editModalPermission={ALL_PERMISSIONS.VIOLATIONS.PATCH}
                    handleUpdateStatus={() => handleUpdateStatus(violation._id)}
                    updateStatusPermission={
                      ALL_PERMISSIONS.VIOLATIONS.PATCH_STATUS
                    }
                    handleDeleteRecord={() => handleDeleteRecord(violation._id)}
                    deleteRecordPermission={ALL_PERMISSIONS.VIOLATIONS.DELETE}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {violationList.length > 0 && (
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
          dataSource={violationList}
          rowKey={'_id'}
          loading={loading}
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
      <ViolationModal
        modalType={modalType}
        violationData={violationUpdateData}
        branchList={branchList}
        handlerList={handlerList}
        setViolationData={setViolationUpdateData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchViolationList={
          reason ||
          dateOfViolation ||
          level ||
          violationStatus ||
          handlerName ||
          branchName
            ? () =>
                fetchViolationList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      branchName,
                      reason,
                      dateOfViolation,
                      level,
                      violationStatus,
                      handlerName,
                    ),
                  ),
                )
            : () =>
                fetchViolationList(meta.current, meta.pageSize, '-createdAt')
        }
        violationLevelOptions={violationLevelOptions}
      />
    </div>
  );
};

export default Staff;
