'use client';

import Loading from '@/components/admin/global/Loading';
import SearchInput from '@/components/admin/global/SearchInput';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  DatePicker,
  Flex,
  Row,
  Select,
  Typography,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Table, { ColumnsType } from 'antd/es/table';
import { DatePickerProps, Pagination } from 'antd/lib';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useSession } from 'next-auth/react';
import numeral from 'numeral';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import SearchButton from '../../global/SearchButton';
import AppTitle from '../../global/Title';
import ContractCards from '../card/ContractCards';
import ContractModal from '../modal/ContractModal';

interface IProps {
  permissionList: IPermission[];
}

const Staff = (props: IProps) => {
  const { permissionList } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [contractList, setContractList] = useState<IContract[]>([]);
  const [templateContent, setTemplateContent] = useState<string | null>(null);
  const [modalType, setModalType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contractUpdateData, setContractUpdateData] =
    useState<null | IContract>(null);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [contractStatus, setContractStatus] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
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
      fetchContractTemplate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !code &&
      !startDate &&
      !endDate &&
      !contractStatus &&
      !studentName &&
      !branchName &&
      permissionList.length
    ) {
      fetchContractList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (code ||
        startDate ||
        endDate ||
        contractStatus ||
        studentName ||
        branchName)
    ) {
      fetchContractList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(
          queryParams(
            branchName,
            code,
            startDate,
            endDate,
            contractStatus,
            studentName,
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
    if (contractList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({
          ...prevMeta,
          current: prevMeta.current - 1,
        }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchContractList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString != '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/contracts?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );

        setContractList(res?.data?.data?.result as IContract[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setContractList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/contracts?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setContractList(res?.data?.data?.result as IContract[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setContractList([]);
        setIsLoading(false);
      }
    }
  };

  const fetchOneContract = async (_id: string) => {
    try {
      const res = await axiosAuth.get(`/contracts/${_id}`);
      setContractUpdateData(res?.data?.data as IContract);
    } catch (error) {
      setContractUpdateData(null);
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

  const fetchContractDetails = async (_id: string) => {
    try {
      const res = await axiosAuth.get(`/contracts/${_id}`);
      return res?.data?.data as IContract;
    } catch (error) {
      return null;
    }
  };

  const fetchContractTemplate = async () => {
    const res = await fetch('/hop-dong-thue.html');
    const content = await res.text();
    setTemplateContent(content);
  };

  const handleConfirmDeleteContract = async (contract: IContract) => {
    try {
      const res = await axiosAuth.delete(`/contracts/${contract._id}`);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (
          code ||
          startDate ||
          endDate ||
          contractStatus ||
          studentName ||
          branchName
        ) {
          fetchContractList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(
              queryParams(
                branchName,
                code,
                startDate,
                endDate,
                contractStatus,
                studentName,
              ),
            ),
          );
        } else {
          fetchContractList(meta.current, meta.pageSize, '-createdAt');
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

  const handleSignContract = async (contract: IContract) => {
    const data = {
      _id: contract._id,
      status: 'Đã ký',
    };

    try {
      const res = await axiosAuth.patch(`/contracts/status`, data);
      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        fetchContractList(meta.current, meta.pageSize, '-createdAt');
      }
    } catch (error: any) {
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleTerminateContract = async (contract: IContract) => {
    const data = {
      _id: contract._id,
      status: 'Chấm dứt',
    };

    try {
      const res = await axiosAuth.patch(`/contracts/status`, data);
      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        fetchContractList(meta.current, meta.pageSize, '-createdAt');
      }
    } catch (error: any) {
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = async (modalType: string, contract?: IContract) => {
    if (modalType === 'add') {
      setModalType('add');
      setIsModalOpen(true);
    } else if (modalType === 'view' && contract) {
      await fetchOneContract(contract._id);
      setModalType('view');
      setIsModalOpen(true);
    } else if (modalType === 'edit' && contract) {
      setModalType('edit');
      setContractUpdateData(contract);
      setIsModalOpen(true);
    }
  };

  const generateNewTabContent = (contract: IContract) => {
    const placeholders: Record<string, string | undefined> = {
      NGAY_TAO: dayjs(contract.createdDate).date().toString(),
      THANG_TAO: (dayjs(contract.startDate).month() + 1).toString(),
      NAM_TAO: dayjs(contract.createdDate).year().toString(),
      HO_TEN: contract.student.fullName.toLocaleUpperCase(),
      MSSV: contract.student.code,
      NGANH: contract.student.major.name,
      NGAY_SINH: dayjs(contract.student.dateOfBirth)
        .format('DD/MM/YYYY')
        .toString(),
      QUE_QUAN: contract.student.homeTown,
      SO_DIEN_THOAI: contract.student.phone,
      KTX: contract.branch.name,
      LOAI_PHONG: contract.roomType.name,
      NGAY_GIAO: dayjs(contract.startDate).date().toString(),
      THANG_GIAO: (dayjs(contract.startDate).month() + 1).toString(),
      NAM_GIAO: dayjs(contract.startDate).year().toString(),
      NGAY_HAN: dayjs(contract.endDate).date().toString(),
      THANG_HAN: (dayjs(contract.endDate).month() + 1).toString(),
      NAM_HAN: dayjs(contract.endDate).year().toString(),
      TIEN_THUE: numeral(contract.roomType?.price).format('0,0').toString(),
      TIEN_THUE_CHU: contract.roomType.priceInWords,
    };

    let replacedContent: any = templateContent;
    Object.keys(placeholders).forEach((placeholder) => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      replacedContent = replacedContent?.replace(
        regex,
        placeholders[placeholder],
      );
    });

    return replacedContent || '';
  };

  const handleExportRecord = async (_id: string) => {
    try {
      const contract: any = await fetchContractDetails(_id);
      const newTabContent = generateNewTabContent(contract);
      const blob = new Blob([newTabContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error(
        'Error fetching template or generating new tab content: ',
        error,
      );
    }
  };

  const queryParams = (
    branchName: string,
    code?: string,
    startDate?: string,
    endDate?: string,
    contractStatus?: string,
    studentName?: string,
  ) => {
    const param: any = {};

    if (branchName) param.branchName = branchName;
    if (code) param.code = code;
    if (startDate) param.startDate = startDate;
    if (endDate) param.endDate = endDate;
    if (contractStatus) param.status = contractStatus;
    if (studentName) param.studentName = studentName;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.startDate) query.startDate = query.startDate;
    if (query.endDate) query.endDate = query.endDate;
    if (query.status) query.status = `/${query.status}/i`;
    if (query.studentName) query.studentName = query.studentName;
    if (query.branchName) query.branchName = query.branchName;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const handleStartDatePicker: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      let chosenDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(chosenDate);
    } else setStartDate('');
  };

  const handleEndDatePicker: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      let chosenDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(chosenDate);
    } else setEndDate('');
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IContract> = [
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
      title: 'Loại phòng',
      dataIndex: ['roomType', 'name'],
      key: 'roomType',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Phòng',
      dataIndex: ['room', 'code'],
      key: 'roomType',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '25%',
      render: (_, record) => {
        return record.status === 'Mới tạo' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
            handleEditModal={() => handleModal('edit', record)}
            editModalPermission={ALL_PERMISSIONS.CONTRACTS.PATCH}
            handleDeleteRecord={() => handleConfirmDeleteContract(record)}
            deleteRecordPermission={ALL_PERMISSIONS.CONTRACTS.DELETE}
            handleExportRecord={() => handleExportRecord(record._id)}
            exportRecordPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
            handleSignContract={() => {
              handleSignContract(record);
            }}
            signContractPermission={ALL_PERMISSIONS.CONTRACTS.PATCH_STATUS}
            permissionList={permissionList}
          />
        ) : record.status === 'Đã ký' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
            handleExportRecord={() => handleExportRecord(record._id)}
            exportRecordPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
            handleTerminateContract={() => {
              handleTerminateContract(record);
            }}
            terminateContractPermission={ALL_PERMISSIONS.CONTRACTS.PATCH_STATUS}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
            handleExportRecord={() => handleExportRecord(record._id)}
            exportRecordPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="contract-page">
      <AppTitle
        moduleName="Hợp Đồng"
        handleAddNew={() => handleModal('add')}
        addNewPermission={ALL_PERMISSIONS.CONTRACTS.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput label="Mã" placeholder="Nhập mã" setState={setCode} />
        </Col>
        <Col xs={12} sm={12} md={9} lg={9} xl={9} xxl={9}>
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
        <Col xs={12} sm={12} md={9} lg={9} xl={9} xxl={9}>
          <SearchInput
            label="Sinh viên"
            placeholder="Nhập sinh viên"
            setState={setStudentName}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder="Chọn trạng thái"
            options={[
              { value: 'Còn hạn', label: 'Còn hạn' },
              { value: 'Hết hạn', label: 'Hết hạn' },
            ]}
            onChange={(e) => setContractStatus(e)}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <Typography.Text>Ngày vào ở</Typography.Text>
          <DatePicker
            locale={locale}
            style={{ width: '100%' }}
            placeholder="Chọn ngày vào ở"
            format="DD-MM-YYYY"
            onChange={handleStartDatePicker}
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <Typography.Text>Ngày ngừng ở</Typography.Text>
          <DatePicker
            locale={locale}
            style={{ width: '100%' }}
            placeholder="Chọn ngày ngừng ở"
            format="DD-MM-YYYY"
            onChange={handleEndDatePicker}
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchContractList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      branchName,
                      code,
                      startDate,
                      endDate,
                      contractStatus,
                      studentName,
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
            {contractList.map((contract) => {
              return (
                <Col xs={24} sm={12} key={contract._id}>
                  <ContractCards
                    dataSource={contract}
                    handleViewRecord={() => handleModal('view', contract)}
                    viewRecordPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
                    handleEditRecord={() => handleModal('edit', contract)}
                    editRecordPermission={ALL_PERMISSIONS.CONTRACTS.PATCH}
                    handleDeleteRecord={() =>
                      handleConfirmDeleteContract(contract)
                    }
                    deleteRecordPermission={ALL_PERMISSIONS.CONTRACTS.DELETE}
                    handleExportRecord={() => handleExportRecord(contract._id)}
                    exportRecordPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
                    handleSignContract={() => handleSignContract(contract)}
                    signContractPermission={
                      ALL_PERMISSIONS.CONTRACTS.PATCH_STATUS
                    }
                    handleTerminateContract={() =>
                      handleTerminateContract(contract)
                    }
                    terminateContractPermission={
                      ALL_PERMISSIONS.CONTRACTS.PATCH_STATUS
                    }
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {contractList.length > 0 && (
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
          dataSource={contractList}
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
      <ContractModal
        modalType={modalType}
        contractData={contractUpdateData}
        branchList={branchList}
        setContractData={setContractUpdateData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchContractList={
          code ||
          startDate ||
          endDate ||
          contractStatus ||
          studentName ||
          branchName
            ? () =>
                fetchContractList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(
                      branchName,
                      code,
                      startDate,
                      endDate,
                      contractStatus,
                      studentName,
                    ),
                  ),
                )
            : () => fetchContractList(meta.current, meta.pageSize, '-createdAt')
        }
      />
    </div>
  );
};

export default Staff;
