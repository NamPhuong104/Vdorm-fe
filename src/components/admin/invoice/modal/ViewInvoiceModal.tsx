'use client';

import StatusLabel from '@/components/admin/global/StatusLabel';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Modal, Pagination, Row, notification } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import InvoiceDetailCard from '../card/InvoiceDetailCard';
import UpdateElectricityModal from './UpdateElectricityModal';
import ViewInvoiceDetailDrawer from './ViewInvoiceDetailDrawer';

interface IProps {
  isViewModalOpen: boolean;
  setIsViewModalOpen: (value: boolean) => void;
  invoiceViewData: null | IInvoice;
  setInvoiceViewData: (value: null | IInvoice) => void;
  fetchInvoiceList: () => void;
  permissionList: IPermission[];
}

const ViewInvoiceModal = (props: IProps) => {
  const {
    isViewModalOpen,
    setIsViewModalOpen,
    invoiceViewData,
    setInvoiceViewData,
    fetchInvoiceList,
    permissionList,
  } = props;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [invoiceDetailList, setInvoiceDetailList] = useState<IInvoiceDetail[]>(
    [],
  );
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [invoiceDetailViewData, setInvoiceDetailViewData] =
    useState<null | IInvoiceDetail>(null);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [isUpdateElectricityModalOpen, setIsUpdateElectricityModalOpen] =
    useState<boolean>(false);
  const [electricityUpdateData, setElectricityUpdateData] =
    useState<null | IInvoiceDetail>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated' && invoiceViewData) {
      fetchInvoiceDetailList(invoiceViewData._id);
      setInvoiceId(invoiceViewData._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, invoiceViewData, meta.current, meta.pageSize]);

  const fetchInvoiceDetailList = async (invoiceId: string) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(
        `/invoice-details?sort=-createdAt&current=${meta.current}&pageSize=${meta.pageSize}&invoice=${invoiceId}`,
      );
      setInvoiceDetailList(res?.data?.data?.result as IInvoiceDetail[]);
      setMeta({
        current: res?.data?.data?.meta?.current,
        pageSize: res?.data?.data?.meta?.pageSize,
        pages: res?.data?.data?.meta?.pages,
        total: res?.data?.data?.meta?.total,
      });
      setIsLoading(false);
    } catch (error: any) {
      setInvoiceDetailList([]);
      setIsLoading(false);
    }
  };

  const handleConfirmUpdateStatus = async (record: any, invoiceId: string) => {
    const { month, year } = record;
    const data = { month, year, invoice: invoiceId };

    try {
      const res = await axiosAuth.post(`/invoice-details/status`, data);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Thanh toán thành công !',
          duration: 2,
        });
        fetchInvoiceDetailList(invoiceId);
        fetchInvoiceList();
      }
    } catch (error: any) {
      notification.error({
        message: 'Thanh toán thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleCloseViewModal = () => {
    setInvoiceViewData(null);
    setInvoiceDetailList([]);
    setIsViewModalOpen(false);
  };

  const handleModal = (modalType: string, value?: IInvoiceDetail) => {
    if (modalType === 'view' && value) {
      setInvoiceDetailViewData(value);
      setIsViewDrawerOpen(true);
    } else if (modalType === 'update' && value) {
      setElectricityUpdateData(value);
      setIsUpdateElectricityModalOpen(true);
    }
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<IInvoiceDetail> = [
    {
      title: 'Thời gian',
      key: 'time',
      align: 'center',
      width: '20%',
      ellipsis: true,
      render: (_, record) => {
        return `${record.month}/${record.year}`;
      },
    },
    {
      title: 'Tổng tiền (VND)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'center',
      width: '25%',
      ellipsis: true,
      render: (_, record) => {
        return currencyFormat(record.totalAmount);
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '30%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <StatusLabel
            data={record.status}
            type={record.status === 'Đã thanh toán' ? 1 : 3}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '25%',
      render: (_, record) => {
        return record.electricityNumber === false &&
          record.status === 'Chưa thanh toán' ? (
          <ActionButtons
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.INVOICE_DETAILS.GET}
            handleElectricRecording={() => handleModal('update', record)}
            electricRecordingPermission={
              ALL_PERMISSIONS.INVOICE_DETAILS.POST_ELECTRICITY
            }
            permissionList={permissionList}
          />
        ) : record.electricityNumber === true &&
          record.status === 'Chưa thanh toán' ? (
          <ActionButtons
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.INVOICE_DETAILS.GET}
            handleUpdateStatus={() =>
              handleConfirmUpdateStatus(record, invoiceId)
            }
            updateStatusPermission={ALL_PERMISSIONS.INVOICE_DETAILS.POST_STATUS}
            permissionList={permissionList}
          />
        ) : (
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
    <Modal
      title="Thông tin chi tiết hóa đơn"
      open={isViewModalOpen}
      centered
      width={'85vw'}
      onCancel={handleCloseViewModal}
      footer={null}
    >
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <div style={{ height: '80vh', width: '80vw' }}>
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <HashLoader color="#d72134" />
            </div>
          </div>
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {invoiceDetailList.map((invoiceDetail) => {
              return (
                <Col xs={24} sm={12} key={invoiceDetail._id}>
                  <InvoiceDetailCard
                    dataSource={invoiceDetail}
                    handleViewDrawer={() => handleModal('view', invoiceDetail)}
                    viewDrawerPermission={ALL_PERMISSIONS.INVOICE_DETAILS.GET}
                    handleUpdateElectricityModal={() =>
                      handleModal('update', invoiceDetail)
                    }
                    updateElectricityModalPermission={
                      ALL_PERMISSIONS.INVOICE_DETAILS.POST_ELECTRICITY
                    }
                    handleUpdateStatusModal={() =>
                      handleConfirmUpdateStatus(invoiceDetail, invoiceId)
                    }
                    updateStatusModalPermission={
                      ALL_PERMISSIONS.INVOICE_DETAILS.POST_STATUS
                    }
                    isPaid={
                      invoiceDetail.status === 'Đã thanh toán' ? true : false
                    }
                    haveElectricityNumber={invoiceDetail.electricityNumber}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {invoiceDetailList.length > 0 && (
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
          dataSource={invoiceDetailList}
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
          }}
        />
      )}
      <ViewInvoiceDetailDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        invoiceDetailViewData={invoiceDetailViewData}
        setInvoiceDetailViewData={setInvoiceDetailViewData}
      />
      <UpdateElectricityModal
        isUpdateElectricityModalOpen={isUpdateElectricityModalOpen}
        setIsUpdateElectricityModalOpen={setIsUpdateElectricityModalOpen}
        electricityUpdateData={electricityUpdateData}
        setElectricityUpdateData={setElectricityUpdateData}
        fetchInvoiceDetailList={() => fetchInvoiceDetailList(invoiceId)}
        invoiceId={invoiceId}
      />
    </Modal>
  );
};

export default ViewInvoiceModal;
