'use client';

import Loading from '@/components/admin/global/Loading';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import AppTitle from '../../global/Title';
import ContractCards from '../card/ContractCards';
import ContractModal from '../modal/ContractModal';

interface IProps {
  permissionList: IPermission[];
}

const Student = (props: IProps) => {
  const { permissionList } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [contractList, setContractList] = useState<IContract[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [templateContent, setTemplateContent] = useState<string | null>(null);
  const [modalType, setModalType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contractUpdateData, setContractUpdateData] =
    useState<null | IContract>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContractTemplate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchContractList(meta.current, meta.pageSize, '-createdAt');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (contractList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
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
  ) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(
        `/contracts/student?_id=${session?.account?._id}&current=${current}&pageSize=${pageSize}&sort=${sort}`,
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
  };

  const fetchOneContract = async (_id: string) => {
    try {
      const res = await axiosAuth.get(`/contracts/${_id}`);
      setContractUpdateData(res?.data?.data as IContract);
      return res?.data?.data as IContract;
    } catch (error) {
      setContractUpdateData(null);
      return null;
    }
  };

  const fetchContractTemplate = async () => {
    const res = await fetch('/hop-dong-thue.html');
    const content = await res.text();
    setTemplateContent(content);
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
      const contract: any = await fetchOneContract(_id);
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

  const handleModal = async (modalType: string, contract?: IContract) => {
    if (modalType === 'view' && contract) {
      await fetchOneContract(contract._id);
      setModalType('view');
      setIsModalOpen(true);
    }
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<IContract> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: '20%',
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
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Phòng',
      dataIndex: ['room', 'code'],
      key: 'roomType',
      align: 'center',
      width: '20%',
      ellipsis: true,
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
      <AppTitle moduleName="Hợp Đồng" />
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
                    handleExportRecord={() => handleExportRecord(contract._id)}
                    exportRecordPermission={ALL_PERMISSIONS.CONTRACTS.GET_ID}
                    permissionList={permissionList}
                    role="Sinh viên"
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
        branchList={null}
        setContractData={setContractUpdateData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchContractList={() =>
          fetchContractList(meta.current, meta.pageSize, '-createdAt')
        }
      />
    </div>
  );
};

export default Student;
