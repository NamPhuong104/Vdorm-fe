'use client';

import Loading from '@/components/admin/global/Loading';
import SearchInput from '@/components/admin/global/SearchInput';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  Flex,
  Pagination,
  Row,
  Select,
  Typography,
  notification,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import AppTitle from '../global/Title';
import InfrastructureTypesCards from './card/InfrastructureTypesCards';
import InfrastructureTypesModal from './modal/InfrastructureTypesModal';

const InfrastructureType = () => {
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(true);
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [infrastructureTypeList, setInfrastructureTypeList] = useState<
    IInfrastructureType[]
  >([]);
  const [modalType, setModalType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [infrastructureTypeUpdateData, setInfrastructureTypeUpdateData] =
    useState<null | IInfrastructureType>(null);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const branchOptions = branchList?.map((branch) => {
    return { value: branch._id, label: branch.name };
  });

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
      !branchName &&
      permissionList.length
    ) {
      fetchInfrastructureTypeList(meta.current, meta.pageSize, '-createdAt');
    } else if (status === 'authenticated' && (code || name || branchName)) {
      fetchInfrastructureTypeList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(branchName, code, name)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (infrastructureTypeList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infrastructureTypeList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchInfrastructureTypeList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString != '') {
      try {
        setLoading(true);
        const res = await axiosAuth.get(
          `/infrastructure-types?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setInfrastructureTypeList(
          res?.data?.data?.result as IInfrastructureType[],
        );
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setLoading(false);
      } catch (error) {
        setInfrastructureTypeList([]);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await axiosAuth.get(
          `/infrastructure-types?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setInfrastructureTypeList(
          res?.data?.data?.result as IInfrastructureType[],
        );
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setLoading(false);
      } catch (error) {
        setInfrastructureTypeList([]);
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

  const handleDeleteRecord = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/infrastructure-types/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (code || name || branchName) {
          fetchInfrastructureTypeList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(branchName, code, name)),
          );
        } else {
          fetchInfrastructureTypeList(
            meta.current,
            meta.pageSize,
            '-createdAt',
          );
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

  const handleModal = (modalType: string, value?: IInfrastructureType) => {
    if (modalType === 'add') {
      setModalType('add');
      setIsModalOpen(true);
    } else if (modalType === 'view' && value) {
      setModalType('view');
      setIsModalOpen(true);
      setInfrastructureTypeUpdateData(value);
    } else if (modalType === 'edit' && value) {
      setModalType('edit');
      setIsModalOpen(true);
      setInfrastructureTypeUpdateData(value);
    }
  };

  const queryParams = (branchName: string, code?: string, name?: string) => {
    const param: any = {};

    if (code) param.code = code;
    if (name) param.name = name;
    if (branchName) param.branchName = branchName;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.code) query.code = `/${query.code}/i`;
    if (query.name) query.name = `/${query.name}/i`;
    if (query.branchName) query.branchName = `${query.branchName}`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<IInfrastructureType> = [
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
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '35%',
      ellipsis: true,
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
            viewModalPermission={ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.GET}
            handleEditModal={() => handleModal('edit', record)}
            editModalPermission={ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.PATCH}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="infrastructure-type-page">
      <AppTitle
        moduleName="Loại Cơ Sở Vật Chất"
        handleAddNew={() => handleModal('add')}
        addNewPermission={ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.POST}
        permissionList={permissionList}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput label="Mã" placeholder="Nhập mã" setState={setCode} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <SearchInput label="Tên" placeholder="Nhập tên" setState={setName} />
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={9} xxl={9}>
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
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() =>
                fetchInfrastructureTypeList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(branchName, code, name)),
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
            {infrastructureTypeList.map((infrastructureType) => {
              return (
                <Col xs={24} sm={12} key={infrastructureType._id}>
                  <InfrastructureTypesCards
                    dataSource={infrastructureType}
                    handleViewDrawer={() =>
                      handleModal('view', infrastructureType)
                    }
                    viewDrawerPermission={
                      ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.GET
                    }
                    handleEditModal={() =>
                      handleModal('edit', infrastructureType)
                    }
                    editModalPermission={
                      ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.PATCH
                    }
                    handleDeleteRecord={() =>
                      handleDeleteRecord(infrastructureType._id)
                    }
                    deleteRecordPermission={
                      ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.DELETE
                    }
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {infrastructureTypeList.length > 0 && (
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
          dataSource={infrastructureTypeList}
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
      <InfrastructureTypesModal
        modalType={modalType}
        infrastructureTypeData={infrastructureTypeUpdateData}
        branchList={branchList}
        setInfrastructureTypeData={setInfrastructureTypeUpdateData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchInfrastructureTypesList={
          code || name || branchName
            ? () =>
                fetchInfrastructureTypeList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(queryParams(branchName, code, name)),
                )
            : () =>
                fetchInfrastructureTypeList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                )
        }
      />
    </div>
  );
};

export default InfrastructureType;
