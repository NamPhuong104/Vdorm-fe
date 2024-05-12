'use client';

import Loading from '@/components/admin/global/Loading';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import StatusLabel from '../../global/StatusLabel';
import AppTitle from '../../global/Title';
import InvoiceDetailCard from '../card/InvoiceDetailCard';
import ViewInvoiceDetailDrawer from '../modal/ViewInvoiceDetailDrawer';

interface IProps {
  permissionList: IPermission[];
}

const Student = (props: IProps) => {
  const { permissionList } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [invoiceDetailList, setInvoiceDetailList] = useState<IInvoiceDetail[]>(
    [],
  );
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [invoiceDetailViewData, setInvoiceDetailViewData] =
    useState<null | IInvoiceDetail>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchInvoiceDetailList(meta.current, meta.pageSize, '-createdAt');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  const fetchInvoiceDetailList = async (
    current: number,
    pageSize: number,
    sort: string,
  ) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(
        `/invoice-details/student?_id=${session?.account?._id}&current=${current}&pageSize=${pageSize}&sort=${sort}`,
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

  const handleModal = (modalType: string, value?: IInvoiceDetail) => {
    if (modalType === 'view' && value) {
      setInvoiceDetailViewData(value);
      setIsViewDrawerOpen(true);
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
        return (
          <ActionButtons
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.INVOICE_DETAILS.GET_STUDENT}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="invoice-page">
      <AppTitle moduleName="Hóa Đơn" />
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {invoiceDetailList.map((invoiceDetail) => {
              return (
                <Col xs={24} sm={12} key={invoiceDetail._id}>
                  <InvoiceDetailCard
                    dataSource={invoiceDetail}
                    handleViewDrawer={() => handleModal('view', invoiceDetail)}
                    viewDrawerPermission={
                      ALL_PERMISSIONS.INVOICE_DETAILS.GET_STUDENT
                    }
                    permissionList={permissionList}
                    role="Sinh viên"
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
    </div>
  );
};

export default Student;
