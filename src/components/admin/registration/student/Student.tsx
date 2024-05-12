'use client';

import Loading from '@/components/admin/global/Loading';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import { Col, Flex, notification, Pagination, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../../global/ActionButtons';
import StatusLabel from '../../global/StatusLabel';
import AppTitle from '../../global/Title';
import RegistrationCard from '../card/RegistrationCard';
import ViewRegistrationDrawer from '../modal/ViewRegistrationDrawer';

interface IProps {
  permissionList: IPermission[];
}

const Student = (props: IProps) => {
  const { permissionList } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [registrationList, setRegistrationList] = useState<IRegistration[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState<boolean>(false);
  const [registrationViewData, setRegistrationViewData] =
    useState<null | IRegistration>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (status === 'authenticated' && permissionList.length) {
      fetchRegistrationList(meta.current, meta.pageSize, '-createdAt');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (registrationList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchRegistrationList = async (
    current: number,
    pageSize: number,
    sort: string,
  ) => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.get(
        `/registrations/student?_id=${session?.account?._id}&current=${current}&pageSize=${pageSize}&sort=${sort}`,
      );
      setRegistrationList(res?.data?.data?.result as IRegistration[]);
      setMeta({
        current: res?.data?.data?.meta?.current,
        pageSize: res?.data?.data?.meta?.pageSize,
        pages: res?.data?.data?.meta?.pages,
        total: res?.data?.data?.meta?.total,
      });
      setIsLoading(false);
    } catch (error: any) {
      setRegistrationList([]);
      setIsLoading(false);
    }
  };

  const handleConfirmDeleteRegistration = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/registrations/${_id}`);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        fetchRegistrationList(meta.current, meta.pageSize, '-createdAt');
      }
    } catch (error: any) {
      notification.error({
        message: 'Xóa thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = (modalType: string, value?: IRegistration) => {
    if (modalType === 'view' && value) {
      setRegistrationViewData(value);
      setIsViewDrawerOpen(true);
    }
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const columns: ColumnsType<IRegistration> = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
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
      key: 'branch',
      align: 'center',
      width: '20%',
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
              ['Đang chờ xử lý', 'Hết phòng'].includes(record.status)
                ? 3
                : record.status === 'Đang xử lý'
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
      render: (record) => {
        return record.status === 'Đang chờ xử lý' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.REGISTRATIONS.GET_STUDENT}
            handleDeleteRecord={() =>
              handleConfirmDeleteRegistration(record._id)
            }
            deleteRecordPermission={ALL_PERMISSIONS.REGISTRATIONS.DELETE}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.REGISTRATIONS.GET_STUDENT}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  return (
    <div className="registration-page">
      <AppTitle moduleName="Đơn Đăng Ký" />
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {registrationList.map((registration) => {
              return (
                <Col xs={24} sm={12} key={registration._id}>
                  <RegistrationCard
                    dataSource={registration}
                    handleViewDrawer={() => handleModal('view', registration)}
                    viewDrawerPermission={
                      ALL_PERMISSIONS.REGISTRATIONS.GET_STUDENT
                    }
                    handleDeleteRecord={() =>
                      handleConfirmDeleteRegistration(registration._id)
                    }
                    deleteRecordPermission={
                      ALL_PERMISSIONS.REGISTRATIONS.DELETE
                    }
                    permissionList={permissionList}
                    role="Sinh viên"
                  />
                </Col>
              );
            })}
            {registrationList.length > 0 && (
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
                    pageSizeOptions={[5, 10, 15, 20]}
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
          dataSource={registrationList}
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
            pageSizeOptions: [5, 10, 15, 20],
            showSizeChanger: true,
          }}
          style={{ padding: '0px 3px' }}
        />
      )}
      <ViewRegistrationDrawer
        isViewDrawerOpen={isViewDrawerOpen}
        setIsViewDrawerOpen={setIsViewDrawerOpen}
        registrationViewData={registrationViewData}
        setRegistrationViewData={setRegistrationViewData}
      />
    </div>
  );
};

export default Student;
