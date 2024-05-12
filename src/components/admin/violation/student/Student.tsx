'use client';

import Loading from '@/components/admin/global/Loading';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, Pagination, Row, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import StatusLabel from '../../global/StatusLabel';
import AppTitle from '../../global/Title';
import ViolationCards from '../card/ViolationCards';
import ViolationModal from '../modal/ViolationModal';

interface IProps {
  permissionList: IPermission[];
}

dayjs.extend(utc);

const Student = (props: IProps) => {
  const { permissionList } = props;
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(true);
  const [violationList, setViolationList] = useState<IViolation[]>([]);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchViolationList(meta.current, meta.pageSize, '-createdAt');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

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
  ) => {
    try {
      setLoading(true);
      const res = await axiosAuth.get(
        `/violations/student?_id=${session?.account?._id}&current=${current}&pageSize=${pageSize}&sort=${sort}`,
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
  };

  const handleModal = (modalType: string, violation?: IViolation) => {
    if (modalType === 'view' && violation) {
      setModalType('view');
      setIsModalOpen(true);
      setViolationUpdateData(violation);
    }
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<IViolation> = [
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
      width: '25%',
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
      width: '25%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <StatusLabel
            data={record.status}
            type={record.status === 'Đã xử lý' ? 1 : 2}
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
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.VIOLATIONS.GET_STUDENT}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="violation-page">
      <AppTitle moduleName="Vi Phạm" />
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
                    viewDrawerPermission={
                      ALL_PERMISSIONS.VIOLATIONS.GET_STUDENT
                    }
                    permissionList={permissionList}
                    role="Sinh viên"
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
        branchList={null}
        handlerList={null}
        setViolationData={setViolationUpdateData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchViolationList={() =>
          fetchViolationList(meta.current, meta.pageSize, '-createdAt')
        }
        violationLevelOptions={[]}
      />
    </div>
  );
};

export default Student;
