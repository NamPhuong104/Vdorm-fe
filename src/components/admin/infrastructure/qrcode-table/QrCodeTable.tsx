'use client';

import SearchButton from '@/components/admin/global/SearchButton';
import SearchInput from '@/components/admin/global/SearchInput';
import { useAxiosAuth } from '@/util/customHook';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Flex,
  Image,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import JSZip from 'jszip';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

interface IProps {
  isQrCodeOpen: boolean;
  setIsQrCodeOpen: (value: boolean) => void;
  infrastructureId: string;
}

const QrCodeTable = (props: IProps) => {
  const { isQrCodeOpen, setIsQrCodeOpen, infrastructureId } = props;
  const router = useRouter();
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [infrastructureQrList, setInfrastructureQrList] = useState<
    IInfrastructureQRCode[]
  >([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedQrRows, setSelectedQrRows] = useState<IInfrastructureQRCode[]>(
    [],
  );
  const [QrCodeImageModal, setQrCodeImageModal] = useState<boolean>(false);
  const [QrCodeImage, setQrCodeImage] = useState<IInfrastructureQRCode>();
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (infrastructureId !== '' && status === 'authenticated') {
      fetchInfrastructureQRList(
        meta.current,
        meta.pageSize,
        'code',
        buildQueryString(queryParams(infrastructureId)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infrastructureId, status, meta.current, meta.pageSize]);

  useEffect(() => {
    if (selectedRowKeys.length !== 0 && !isQrCodeOpen) {
      setSelectedRowKeys([]);
    }
  }, [selectedRowKeys, isQrCodeOpen]);

  const fetchInfrastructureQRList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setInfrastructureQrList([]);
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/infrastructure-qr-codes?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setInfrastructureQrList(
          res?.data?.data?.result as IInfrastructureQRCode[],
        );
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setInfrastructureQrList([]);
        setIsLoading(false);
      }
    }
  };

  const queryParams = (infrastructure: string, code?: string) => {
    const param: any = {};

    if (code) param.code = code;
    if (infrastructure) param.infrastructure = infrastructure;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.infrastructure) query.infrastructure = `${query.infrastructure}`;
    if (query.code) query.code = `/${query.code}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const onDownloadOne = (
    src: string | undefined,
    fileName: string | undefined,
  ) => {
    if (src) {
      fetch(src)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}.png`;
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
          link.remove();
        });
    }
  };

  const onDownloadMany = async (rows: IInfrastructureQRCode[]) => {
    const zip = new JSZip();

    const fetchAndAddToZip = async (url: string, fileName: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(`${fileName}.png`, blob);
    };

    const fetchAndAddPromises = rows.map((row) =>
      fetchAndAddToZip(row.qrCode, row.code),
    );

    await Promise.all(fetchAndAddPromises);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images.zip';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      link.remove();
    });
  };

  const handleQrCodeImage = (type: string, value: IInfrastructureQRCode) => {
    if (type === 'download') {
      onDownloadOne(value.qrCode, value.code);
    } else if (type === 'view') {
      setQrCodeImage(value);
      setQrCodeImageModal(true);
    }
  };

  const handlePrint = () => {
    if (selectedQrRows.length === 0) {
      notification.error({
        message: 'Vui lòng chọn cơ sở vật chất !',
        duration: 2,
      });
    } else {
      saveDataToLocalStorage('selectedQrRows', selectedQrRows);
      router.push(`/admin/infrastructure/qr-code/${infrastructureId}`);
    }
  };

  const handleDownload = () => {
    if (selectedQrRows.length === 0) {
      notification.error({
        message: 'Vui lòng chọn cơ sở vật chất !',
        duration: 2,
      });
    } else {
      onDownloadMany(selectedQrRows);
    }
  };

  const saveDataToLocalStorage = (key: any, data: any) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  const columns: ColumnsType<IInfrastructureQRCode> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      align: 'center',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '25%',
      render(_, record) {
        return (
          <Space size={'middle'}>
            <Tooltip title="Xem" placement="bottom">
              <Button
                className="action-buttons"
                type="default"
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#448026',
                }}
                icon={<FontAwesomeIcon icon={faEye} />}
                onClick={() => handleQrCodeImage('view', record)}
              />
            </Tooltip>
            <Tooltip title="Tải" placement="bottom">
              <Button
                className="action-buttons"
                type="default"
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#ff8c00',
                }}
                icon={
                  <FontAwesomeIcon
                    icon={faDownload}
                    onClick={() => handleQrCodeImage('download', record)}
                  />
                }
              />
            </Tooltip>
            <Tooltip title="In QR Code" placement="bottom">
              <Button
                className="action-buttons"
                type="default"
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#1653b5',
                }}
                icon={
                  <FontAwesomeIcon
                    icon={faPrint}
                    onClick={() => {
                      saveDataToLocalStorage('selectedQrRows', [record]);
                      router.push(
                        `/admin/infrastructure/qr-code/${record._id}`,
                      );
                    }}
                  />
                }
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Danh sách QR Code"
        maskClosable={false}
        centered
        width={1000}
        open={isQrCodeOpen}
        closable={true}
        onCancel={() => setIsQrCodeOpen(false)}
        footer={null}
      >
        <Flex
          align="flex-end"
          justify="space-between"
          style={{ margin: '5px 0px 15px' }}
        >
          <Flex align="flex-end" gap={10}>
            <SearchInput
              label="Nhập mã"
              setState={setCode}
              placeholder="Nhập mã"
            />
            <SearchButton
              onFetch={() =>
                fetchInfrastructureQRList(
                  meta.current,
                  meta.pageSize,
                  'code',
                  buildQueryString(queryParams(infrastructureId, code)),
                )
              }
            />
          </Flex>
          <Flex align="flex-end" gap={10}>
            <Button
              className="download-btn"
              type="primary"
              size={'middle'}
              style={{
                padding: '4px 18px',
                fontWeight: '600',
                background: '#ff8c00',
                borderColor: '#ff8c00',
                color: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
              }}
              onClick={handleDownload}
            >
              TẢI <DownloadOutlined />
            </Button>
            <Button
              className="print-btn"
              type="primary"
              size={'middle'}
              style={{
                padding: '4px 18px',
                fontWeight: '600',
                background: '#1653b5',
                borderColor: '#1653b5',
                color: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
              }}
              onClick={handlePrint}
            >
              IN <PrinterOutlined />
            </Button>
          </Flex>
        </Flex>
        <Table
          columns={columns}
          dataSource={infrastructureQrList}
          rowKey={'_id'}
          loading={isLoading}
          scroll={{ y: 300 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange(selectedRowKeys, selectedRows, info) {
              setSelectedRowKeys(selectedRowKeys);
              setSelectedQrRows(selectedRows);
            },
          }}
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
        />
      </Modal>
      <Modal
        centered
        open={QrCodeImageModal}
        onCancel={() => setQrCodeImageModal(false)}
        width={400}
        footer={null}
      >
        <Flex align="center" justify="center">
          <Flex align="center" style={{ flexDirection: 'column' }}>
            <Space>
              <Image
                width={30}
                height={30}
                src="/logo.svg"
                alt="logo-vlu"
                preview={false}
              />
              <span
                style={{
                  fontSize: '20px',
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                }}
              >
                VLU
              </span>
            </Space>
            <Image
              width={100}
              src={QrCodeImage?.qrCode}
              alt="infrastructure-qr-code"
              preview={false}
            />
          </Flex>
          <Flex
            align="center"
            justify="flex-end"
            style={{
              flexDirection: 'column',
              fontSize: '15px',
              fontWeight: 600,
              height: '100%',
              paddingTop: '30px',
            }}
          >
            <Typography.Text>{QrCodeImage?.code}</Typography.Text>
            <Typography.Text>{QrCodeImage?.name}</Typography.Text>
            <Typography.Text>{QrCodeImage?.model}</Typography.Text>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};

export default QrCodeTable;
