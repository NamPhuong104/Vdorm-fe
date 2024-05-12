'use client';

import Loading from '@/components/admin/global/Loading';
import SearchInput from '@/components/admin/global/SearchInput';
import { IAccount } from '@/types/next-auth';
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
import locale from 'antd/es/date-picker/locale/vi_VN';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import StatusLabel from '../global/StatusLabel';
import AppTitle from '../global/Title';
import InfrastructureCards from './card/InfrastructureCards';
import InfrastructureModal from './modal/InfrastructureModal';
import QrCodeTable from './qrcode-table/QrCodeTable';

const statusOptions = [
  {
    value: 'Còn bảo hành',
    label: 'Còn bảo hành',
  },
  {
    value: 'Hết bảo hành',
    label: 'Hết bảo hành',
  },
];

const Infrastructure = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [infrastructureList, setInfrastructureList] = useState<
    IInfrastructure[]
  >([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [infrastructureTypeList, setInfrastructureTypeList] = useState<
    IInfrastructureTypeOption[]
  >([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState<boolean>(false);
  const [infrastructureUpdateData, setInfrastructureUpdateData] =
    useState<null | IInfrastructure>(null);
  const [infrastructureId, setInfrastructureId] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [infrastructureStatus, setInfrastructureStatus] = useState<string>('');
  const [importDate, setImportDate] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [infrastructureTypeName, setInfrastructureTypeName] = useState<
    string | null
  >(null);
  const [infrastructureTypeNameOptions, setInfrastructureTypeNameOptions] =
    useState<{ value: string; label: string }[]>([]);

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
      !importDate &&
      !expirationDate &&
      !branch &&
      !infrastructureTypeName &&
      !infrastructureStatus &&
      permissionList.length
    ) {
      fetchInfrastructureList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (code ||
        name ||
        importDate ||
        expirationDate ||
        branch ||
        infrastructureTypeName ||
        infrastructureStatus)
    ) {
      fetchInfrastructureList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(
          queryParams(
            code,
            name,
            importDate,
            expirationDate,
            branch,
            infrastructureTypeName ?? '',
            infrastructureStatus,
          ),
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (status === 'authenticated' && branch) {
      fetchInfrastructureTypeList(branch);
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
    if (infrastructureTypeList) {
      const infrastructureTypeNameOptionsClone: {
        value: string;
        label: string;
      }[] = [];
      infrastructureTypeList.map(
        (infrastructureType: IInfrastructureTypeOption) => {
          infrastructureTypeNameOptionsClone.push({
            value: infrastructureType.name,
            label: infrastructureType.name,
          });
        },
      );
      setInfrastructureTypeNameOptions(infrastructureTypeNameOptionsClone);
    }
  }, [infrastructureTypeList]);

  useEffect(() => {
    if (infrastructureList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infrastructureList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchInfrastructureList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/infrastructures?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setInfrastructureList(res?.data?.data?.result as IInfrastructure[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInfrastructureList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/infrastructures?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setInfrastructureList(res?.data?.data?.result as IInfrastructure[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInfrastructureList([]);
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

  const fetchInfrastructureTypeList = async (branchId: string) => {
    try {
      const res = await axiosAuth.get(
        `/infrastructure-types?branch=${branchId}`,
      );
      setInfrastructureTypeList(
        res?.data?.data?.result as IInfrastructureTypeOption[],
      );
    } catch (error) {
      setInfrastructureTypeList([]);
    }
  };

  const handleDeleteRecord = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/infrastructures/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (
          code ||
          name ||
          importDate ||
          expirationDate ||
          branch ||
          infrastructureTypeName ||
          infrastructureStatus
        ) {
          fetchInfrastructureList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(
                code,
                name,
                importDate,
                expirationDate,
                branch,
                infrastructureTypeName ?? '',
                infrastructureStatus,
              ),
            ),
          );
        } else {
          fetchInfrastructureList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = async (modalType: string, value?: IInfrastructure) => {
    if (modalType === 'add') {
      setModalType('add');
      setIsModalOpen(true);
    } else if (modalType === 'view' && value) {
      setModalType('view');
      setIsModalOpen(true);
      setInfrastructureUpdateData(value);
    } else if (modalType === 'edit' && value) {
      setModalType('edit');
      setIsModalOpen(true);
      setInfrastructureUpdateData(value);
    }
  };

  const queryParams = (
    code: string,
    name: string,
    importDate: string,
    expirationDate: string,
    branch: string,
    infrastructureTypeName: string,
    infrastructureStatus: string,
  ) => {
    const param: any = {};

    if (code) param.code = code;
    if (name) param.name = name;
    if (importDate) param.importDate = importDate;
    if (expirationDate) param.expirationDate = expirationDate;
    if (branch) param.branch = branch;
    if (infrastructureTypeName)
      param.infrastructureTypeName = infrastructureTypeName;
    if (infrastructureStatus) param.status = infrastructureStatus;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.name) query.name = `/${query.name}/i`;
    if (query.importDate) query.importDate = `${query.importDate}`;
    if (query.expirationDate) query.expirationDate = `${query.expirationDate}`;
    if (query.branch) query.branch = `${query.branch}`;
    if (query.infrastructureTypeName)
      query.infrastructureTypeName = `${query.infrastructureTypeName}`;
    if (query.infrastructureStatus) query.status = `/${query.status}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const handleImportDatePicker: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      let chosenDate = dayjs(date).format('YYYY-MM-DD');
      setImportDate(chosenDate);
    } else setImportDate('');
  };

  const handleWarrantyExpirationPicker: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      let chosenDate = dayjs(date).format('YYYY-MM-DD');
      setExpirationDate(chosenDate);
    } else setExpirationDate('');
  };

  const handleQRCode = async (_id: string) => {
    setInfrastructureId(_id);
    setIsQrCodeOpen(true);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IInfrastructure> = [
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
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Còn lại',
      dataIndex: 'infrastructureRemaining',
      key: 'infrastructureRemaining',
      align: 'center',
      width: '10%',
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
          <StatusLabel
            data={record.status}
            type={record.status == 'Hết bảo hành' ? 3 : 1}
          />
        );
      },
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
            handleQRCode={() => {
              handleQRCode(record._id);
            }}
            qrCodePermission={ALL_PERMISSIONS.INFRASTRUCTURE_QR_CODE.GET}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.INFRASTRUCTURES.GET}
            handleEditModal={() => handleModal('edit', record)}
            editModalPermission={ALL_PERMISSIONS.INFRASTRUCTURES.PATCH}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.INFRASTRUCTURES.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="infrastructure-page">
      <AppTitle
        moduleName="Cơ Sở Vật Chất"
        handleAddNew={() => handleModal('add')}
        addNewPermission={ALL_PERMISSIONS.INFRASTRUCTURES.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput label="Mã" placeholder="Nhập mã" setState={setCode} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput label="Tên" placeholder="Nhập tên" setState={setName} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Ngày nhập hàng</Typography.Text>
          <DatePicker
            locale={locale}
            style={{ width: '100%' }}
            placeholder="Chọn ngày nhập hàng"
            format="DD-MM-YYYY"
            onChange={handleImportDatePicker}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Ngày hết hạn</Typography.Text>
          <DatePicker
            locale={locale}
            style={{ width: '100%' }}
            placeholder="Chọn ngày hết hạn"
            format="DD-MM-YYYY"
            onChange={handleWarrantyExpirationPicker}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            style={{ width: '100%' }}
            options={branchOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => {
              setBranch(value);
              setInfrastructureTypeNameOptions([]);
              setInfrastructureTypeName(null);
            }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Typography.Text>Loại</Typography.Text>
          <Select
            allowClear
            style={{ width: '100%' }}
            options={infrastructureTypeNameOptions}
            placeholder="Chọn loại"
            onChange={(value) => {
              setInfrastructureTypeName(value);
            }}
            value={infrastructureTypeName}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={9} xxl={9}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={statusOptions}
            style={{ width: '100%' }}
            placeholder="Chọn trạng thái"
            onClear={() => setInfrastructureStatus('')}
            onSelect={(e) => setInfrastructureStatus(e)}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchInfrastructureList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      code,
                      name,
                      importDate,
                      expirationDate,
                      branch,
                      infrastructureTypeName ?? '',
                      infrastructureStatus,
                    ),
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
            {infrastructureList.map((infrastructure) => {
              return (
                <Col xs={24} sm={12} key={infrastructure._id}>
                  <InfrastructureCards
                    dataSource={infrastructure}
                    handleViewDrawer={() => handleModal('view', infrastructure)}
                    viewDrawerPermission={ALL_PERMISSIONS.INFRASTRUCTURES.GET}
                    handleEditModal={() => handleModal('edit', infrastructure)}
                    editModalPermission={ALL_PERMISSIONS.INFRASTRUCTURES.PATCH}
                    handleDeleteRecord={() =>
                      handleDeleteRecord(infrastructure._id)
                    }
                    deleteRecordPermission={
                      ALL_PERMISSIONS.INFRASTRUCTURES.DELETE
                    }
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {infrastructureList.length > 0 && (
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
          dataSource={infrastructureList}
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
      <InfrastructureModal
        modalType={modalType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        infrastructureData={infrastructureUpdateData}
        setInfrastructureData={setInfrastructureUpdateData}
        fetchInfrastructureList={
          code ||
          name ||
          importDate ||
          expirationDate ||
          branch ||
          infrastructureTypeName ||
          infrastructureStatus
            ? () =>
                fetchInfrastructureList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      code,
                      name,
                      importDate,
                      expirationDate,
                      branch,
                      infrastructureTypeName ?? '',
                      infrastructureStatus,
                    ),
                  ),
                )
            : () =>
                fetchInfrastructureList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                )
        }
        branchList={branchList}
      />
      <QrCodeTable
        isQrCodeOpen={isQrCodeOpen}
        setIsQrCodeOpen={setIsQrCodeOpen}
        infrastructureId={infrastructureId}
      />
    </div>
  );
};

export default Infrastructure;
