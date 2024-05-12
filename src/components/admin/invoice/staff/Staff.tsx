'use client';

import Loading from '@/components/admin/global/Loading';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row, Select, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import SearchButton from '../../global/SearchButton';
import StatusLabel from '../../global/StatusLabel';
import AppTitle from '../../global/Title';
import InvoiceCard from '../card/InvoiceCard';
import CreateInvoiceModal from '../modal/CreateInvoiceModal';
import DeleteInvoiceModal from '../modal/DeleteInvoiceModal';
import SendInvoiceEmailModal from '../modal/SendInvoiceEmailModal';
import ViewInvoiceModal from '../modal/ViewInvoiceModal';

interface IProps {
  permissionList: IPermission[];
  invoiceStatusOptions: { value: string; label: string }[];
}

const Staff = (props: IProps) => {
  const { permissionList, invoiceStatusOptions } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [roomList, setRoomList] = useState<IRoomOption[]>([]);
  const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [invoiceViewData, setInvoiceViewData] = useState<null | IInvoice>(null);
  const [isSendInvoiceEmailModalOpen, setIsSendInvoiceEmailModalOpen] =
    useState<boolean>(false);
  const [branch, setBranch] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomCodeOptions, setRoomCodeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [invoiceStatus, setInvoiceStatus] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBranchList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !branch &&
      !roomCode &&
      !invoiceStatus &&
      permissionList.length
    ) {
      fetchInvoiceList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (branch || roomCode || invoiceStatus)
    ) {
      fetchInvoiceList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(branch, roomCode ?? '', invoiceStatus)),
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
    if (invoiceList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchInvoiceList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/invoices?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setInvoiceList(res?.data?.data?.result as IInvoice[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInvoiceList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/invoices?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setInvoiceList(res?.data?.data?.result as IInvoice[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInvoiceList([]);
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

  const handleModal = (modalType: string, value?: IInvoice) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'delete') {
      setIsDeleteModalOpen(true);
    } else if (modalType === 'view' && value) {
      setInvoiceViewData(value);
      setIsViewModalOpen(true);
    } else if (modalType === 'send-email') {
      setIsSendInvoiceEmailModalOpen(true);
    }
  };

  const queryParams = (branch: string, roomCode: string, status: string) => {
    const param: any = {};

    if (branch) param.branch = branch;
    if (roomCode) param.roomCode = roomCode;
    if (status) param.status = status;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.branch) query.branch = `${query.branch}`;
    if (query.roomCode) query.roomCode = `${query.roomCode}`;
    if (query.status) query.status = `/${query.status}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IInvoice> = [
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Phòng',
      dataIndex: ['room', 'code'],
      key: 'room',
      align: 'center',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '25%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <StatusLabel
            data={record.status}
            type={
              record.status === 'Chưa thanh toán'
                ? 3
                : record.status === 'Không có hóa đơn'
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
      width: '15%',
      render: (_, record) => {
        return (
          <ActionButtons
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.INVOICE_DETAILS.GET}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="invoice-page">
      <AppTitle
        moduleName="Hóa Đơn"
        handleAddNew={() => handleModal('create')}
        addNewPermission={ALL_PERMISSIONS.INVOICE_DETAILS.POST_CREATE_MANY}
        handleDelete={() => handleModal('delete')}
        deletePermission={ALL_PERMISSIONS.INVOICE_DETAILS.POST_REMOVE_MANY}
        handleSendEmail={() => handleModal('send-email')}
        sendEmailPermission={ALL_PERMISSIONS.EMAILS.GET_INVOICE}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            options={branchOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => {
              setBranch(value);
              setRoomCodeOptions([]);
              setRoomCode(null);
            }}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
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
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <Typography.Text>Trạng thái</Typography.Text>
          <Select
            allowClear
            options={invoiceStatusOptions}
            placeholder="Chọn trạng thái"
            onChange={(value) => setInvoiceStatus(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={3}>
          <Flex
            style={{
              flexDirection: 'row-reverse',
            }}
          >
            <SearchButton
              onFetch={() =>
                fetchInvoiceList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(branch, roomCode ?? '', invoiceStatus),
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
            {invoiceList.map((invoice) => {
              return (
                <Col xs={24} sm={12} key={invoice._id}>
                  <InvoiceCard
                    dataSource={invoice}
                    handleViewModal={() => handleModal('view', invoice)}
                    viewModalPermission={ALL_PERMISSIONS.INVOICE_DETAILS.GET}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {invoiceList.length > 0 && (
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
          dataSource={invoiceList}
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
      <CreateInvoiceModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchInvoiceList={() =>
          fetchInvoiceList(meta.current, meta.pageSize, '-createdAt')
        }
      />
      <DeleteInvoiceModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        fetchInvoiceList={() =>
          fetchInvoiceList(meta.current, meta.pageSize, '-createdAt')
        }
      />
      <ViewInvoiceModal
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        invoiceViewData={invoiceViewData}
        setInvoiceViewData={setInvoiceViewData}
        fetchInvoiceList={() =>
          fetchInvoiceList(meta.current, meta.pageSize, '-createdAt')
        }
        permissionList={permissionList}
      />
      <SendInvoiceEmailModal
        isSendInvoiceEmailModalOpen={isSendInvoiceEmailModalOpen}
        setIsSendInvoiceEmailModalOpen={setIsSendInvoiceEmailModalOpen}
      />
    </div>
  );
};

export default Staff;
