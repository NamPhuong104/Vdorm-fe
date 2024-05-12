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
  Radio,
  RadioChangeEvent,
  Row,
  Table,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import AppTitle from '../global/Title';
import ContactCards from './card/ContactCards';
import ContactModal from './modal/ContactModal';

const Contact = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [contactList, setContactList] = useState<IContact[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contactData, setContactData] = useState<null | IContact>(null);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mailStatus, setMailStatus] = useState<string>('Chưa trả lời');

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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !fullName &&
      !email &&
      !phone &&
      permissionList.length
    ) {
      fetchContactList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(fullName, email, phone, mailStatus)),
      );
    } else if (status === 'authenticated' && (fullName || email || phone)) {
      fetchContactList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(fullName, email, phone, mailStatus)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList, mailStatus]);

  useEffect(() => {
    if (contactList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({ ...prevMeta, current: prevMeta.current - 1 }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchContactList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/contacts?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setContactList(res?.data?.data?.result as IContact[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setContactList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/contacts?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setContactList(res?.data?.data?.result as IContact[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setContactList([]);
        setIsLoading(false);
      }
    }
  };

  const handleDeleteRecord = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/contacts/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        fetchContactList(
          meta.current,
          meta.pageSize,
          '-createdAt',
          buildQueryString(queryParams(fullName, email, phone, mailStatus)),
        );
      }
    } catch (error: any) {
      notification.error({
        message: 'Xóa thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleModal = (modalType: string, value?: IContact) => {
    if (modalType === 'view' && value) {
      setModalType('view');
      setIsModalOpen(true);
      setContactData(value);
    } else if (modalType === 'edit' && value) {
      setModalType('edit');
      setIsModalOpen(true);
      setContactData(value);
    }
  };

  const queryParams = (
    fullName: string,
    email: string,
    phone: string,
    mailStatus: string,
  ) => {
    const param: any = {};

    if (fullName) param.fullName = fullName;
    if (email) param.email = email;
    if (phone) param.phone = phone;
    if (mailStatus) param.status = mailStatus;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.fullName) query.fullName = `/${query.fullName}/i`;
    if (query.email) query.email = `/${query.email}/i`;
    if (query.phone) query.phone = `/${query.phone}/i`;
    if (query.status) query.status = `/${query.status}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    setContactList([]);
    setMailStatus(e.target.value);
  };

  const columns: ColumnsType<IContact> = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      width: '30%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'left' }}>
            <span>{record.content}</span>
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_, record) => {
        return mailStatus !== 'Đã trả lời' ? (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.CONTACTS.GET}
            handleEditModal={() => handleModal('edit', record)}
            editModalPermission={ALL_PERMISSIONS.CONTACTS.PATCH_REPLY}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.CONTACTS.DELETE}
            permissionList={permissionList}
          />
        ) : (
          <ActionButtons
            record={record}
            handleViewModal={() => handleModal('view', record)}
            viewModalPermission={ALL_PERMISSIONS.CONTACTS.GET}
            handleDeleteRecord={() => handleDeleteRecord(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.CONTACTS.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="contact-page">
      <AppTitle moduleName="Liên Hệ" />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={8}>
          <SearchInput
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            setState={setFullName}
          />
        </Col>
        <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
          <SearchInput
            label="Email"
            placeholder="Nhập email"
            setState={setEmail}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <SearchInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            setState={setPhone}
          />
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={3} xxl={2}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() => {
                fetchContactList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(fullName, email, phone, mailStatus),
                  ),
                );
              }}
            />
          </Flex>
        </Col>
      </Row>
      {screenSize === 'xs' || screenSize === 'sm' ? (
        <>
          <Flex style={{ marginRight: '7px' }} justify="flex-end">
            <Radio.Group defaultValue={mailStatus} onChange={onChangeRadio}>
              <Radio.Button value="Chưa trả lời">Chưa trả lời</Radio.Button>
              <Radio.Button value="Đang trả lời">Đang trả lời</Radio.Button>
              <Radio.Button value="Đã trả lời">Đã trả lời</Radio.Button>
            </Radio.Group>
          </Flex>
          {isLoading === true ? (
            <Loading />
          ) : (
            <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
              {contactList.map((contact) => {
                return (
                  <Col xs={24} sm={12} key={contact._id}>
                    <ContactCards
                      dataSource={contact}
                      handleViewRecord={() => handleModal('view', contact)}
                      viewRecordPermission={ALL_PERMISSIONS.CONTACTS.GET}
                      handleEditRecord={() => handleModal('edit', contact)}
                      editRecordPermission={
                        ALL_PERMISSIONS.CONTACTS.PATCH_REPLY
                      }
                      handleDeleteRecord={() => handleDeleteRecord(contact._id)}
                      deleteRecordPermission={ALL_PERMISSIONS.CONTACTS.DELETE}
                      permissionList={permissionList}
                    />
                  </Col>
                );
              })}
              {contactList.length > 0 && (
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
                          ? (total, range) =>
                              `${range[0]}-${range[1]} / ${total}`
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
          )}
        </>
      ) : (
        <Table
          title={() => {
            return (
              <Flex justify="space-between">
                <Radio.Group defaultValue={mailStatus} onChange={onChangeRadio}>
                  <Radio.Button value="Chưa trả lời">Chưa trả lời</Radio.Button>
                  <Radio.Button value="Đang trả lời">Đang trả lời</Radio.Button>
                  <Radio.Button value="Đã trả lời">Đã trả lời</Radio.Button>
                </Radio.Group>
                <Pagination
                  locale={{ items_per_page: '/ trang' }}
                  current={meta.current}
                  pageSize={meta.pageSize}
                  total={meta.total}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} / ${total}`
                  }
                  onChange={(page: number, pageSize: number) => {
                    handleChangePage(page, pageSize);
                  }}
                  pageSizeOptions={[10, 20, 30, 40, 50]}
                  showSizeChanger
                />
              </Flex>
            );
          }}
          columns={columns}
          dataSource={contactList}
          rowKey={'_id'}
          loading={isLoading}
          pagination={{ position: ['none'] }}
          style={{ padding: '0px 3px' }}
        />
      )}
      <ContactModal
        modalType={modalType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        contactData={contactData}
        setContactData={setContactData}
        fetchContactList={() =>
          fetchContactList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(fullName, email, phone, mailStatus)),
          )
        }
      />
    </div>
  );
};

export default Contact;
