'use client';

import Loading from '@/components/admin/global/Loading';
import { IAccount } from '@/types/next-auth';
import { useAxiosAuth } from '@/util/customHook';
import { ALL_PERMISSIONS } from '@/util/permission';
import {
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  Image,
  Pagination,
  Row,
  Select,
  Typography,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import ActionButtons from '../global/ActionButtons';
import SearchButton from '../global/SearchButton';
import SearchInput from '../global/SearchInput';
import AppTitle from '../global/Title';
import NewsCard from './card/NewsCard';
import CreateNewsModal from './modal/CreateNewsModal';
import UpdateNewsModal from './modal/UpdateNewsModal';
import ViewNewsModal from './modal/ViewNewsModal';

const categoryOptions: { value: string; label: string }[] = [
  {
    value: 'HOẠT ĐỘNG CỦA VĂN LANG',
    label: 'HOẠT ĐỘNG CỦA VĂN LANG',
  },
  {
    value: 'ĐỜI SỐNG VĂN LANG',
    label: 'ĐỜI SỐNG VĂN LANG',
  },
  {
    value: 'TUYỂN SINH',
    label: 'TUYỂN SINH',
  },
  {
    value: 'HỢP TÁC QUỐC TẾ',
    label: 'HỢP TÁC QUỐC TẾ',
  },
  {
    value: 'NGHIÊN CỨU & SÁNG TẠO',
    label: 'NGHIÊN CỨU & SÁNG TẠO',
  },
];

const News = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const [permissionList, setPermissionList] = useState<IPermission[]>([]);
  const [newsList, setNewsList] = useState<INew[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [newsViewData, setNewsViewData] = useState<null | INew>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [newsUpdateData, setNewsUpdateData] = useState<null | INew>(null);
  const [title, setTitle] = useState<string>('');
  const [publishDate, setPublishDate] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

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
      !title &&
      !publishDate &&
      !category &&
      !author &&
      permissionList.length
    ) {
      fetchNewsList(meta.current, meta.pageSize, '-createdAt');
    } else if (
      status === 'authenticated' &&
      (title || publishDate || category || author)
    ) {
      fetchNewsList(
        meta.current,
        meta.pageSize,
        '-createdAt',
        buildQueryString(queryParams(title, publishDate, category, author)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, meta.pageSize, status, permissionList]);

  useEffect(() => {
    if (newsList.length === 0) {
      if (meta.current > 1)
        setMeta((prevMeta) => ({
          ...prevMeta,
          current: prevMeta.current - 1,
        }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsList]);

  useEffect(() => {
    if (screenSize === 'xs') {
      setMeta({ ...meta, current: 1, pageSize: 10 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const fetchNewsList = async (
    current: number,
    pageSize: number,
    sort: string,
    queryString?: string,
  ) => {
    if (queryString && queryString != '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/news?current=${current}&pageSize=${pageSize}&sort=${sort}&${queryString}`,
        );
        setNewsList(res?.data?.data?.result as INew[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setNewsList([]);
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/news?current=${current}&pageSize=${pageSize}&sort=${sort}`,
        );
        setNewsList(res?.data?.data?.result as INew[]);
        setMeta({
          current: res?.data?.data?.meta?.current,
          pageSize: res?.data?.data?.meta?.pageSize,
          pages: res?.data?.data?.meta?.pages,
          total: res?.data?.data?.meta?.total,
        });
        setIsLoading(false);
      } catch (error: any) {
        setNewsList([]);
        setIsLoading(false);
      }
    }
  };

  const handleConfirmDeleteNews = async (_id: string) => {
    try {
      const res = await axiosAuth.delete(`/news/${_id}`);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Xóa thành công !',
          duration: 2,
        });
        if (title || publishDate || category || author) {
          fetchNewsList(
            meta.current,
            meta.pageSize,
            '-createdAt',
            buildQueryString(queryParams(title, publishDate, category, author)),
          );
        } else {
          fetchNewsList(meta.current, meta.pageSize, '-createdAt');
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

  const handleModal = (modalType: string, value?: INew) => {
    if (modalType === 'create') {
      setIsCreateModalOpen(true);
    } else if (modalType === 'view' && value) {
      setNewsViewData(value);
      setIsViewModalOpen(true);
    } else if (modalType === 'update' && value) {
      setNewsUpdateData(value);
      setIsUpdateModalOpen(true);
    }
  };

  const queryParams = (
    title: string,
    publishDate: string,
    category: string,
    author: string,
  ) => {
    const param: any = {};

    if (title) param.title = title;
    if (publishDate) param.publishDate = publishDate;
    if (category) param.category = category;
    if (author) param.author = author;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.title) query.title = `/${query.title}/i`;
    if (query.publishDate) query.publishDate = `${query.publishDate}`;
    if (query.category) query.category = `${query.category}`;
    if (query.author) query.author = `/${query.author}/i`;

    return queryString.stringify(query);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setMeta({ ...meta, current: page, pageSize: pageSize });
  };

  const handleChangePublishDate: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      setPublishDate(dayjs(date).format('YYYY-MM-DD'));
    } else setPublishDate('');
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<INew> = [
    {
      title: 'Ảnh bìa',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      align: 'center',
      width: '15%',
      render: (_, record) => {
        return (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${record.thumbnail}`}
            alt="thumbnail"
            width={50}
            height={50}
          />
        );
      },
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'publishDate',
      key: 'publishDate',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return dayjs(record.publishDate).format('DD/MM/YYYY');
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
            viewModalPermission={ALL_PERMISSIONS.NEWS.GET}
            handleEditModal={() => handleModal('update', record)}
            editModalPermission={ALL_PERMISSIONS.NEWS.PATCH}
            handleDeleteRecord={() => handleConfirmDeleteNews(record._id)}
            deleteRecordPermission={ALL_PERMISSIONS.NEWS.DELETE}
            permissionList={permissionList}
          />
        );
      },
    },
  ];

  if (!permissionList.length) return <></>;

  return (
    <div className="news-page">
      {screenSize === 'xs' || screenSize === 'sm' ? (
        <Flex align="center" justify="center">
          <Typography.Title
            level={2}
            style={{
              fontSize: '25px',
              fontWeight: 700,
            }}
          >
            Tin tức
          </Typography.Title>
        </Flex>
      ) : (
        <AppTitle
          moduleName="Tin Tức"
          handleAddNew={() => handleModal('create')}
          addNewPermission={ALL_PERMISSIONS.NEWS.POST}
          permissionList={permissionList}
        />
      )}
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={12} sm={12} md={5} lg={5} xl={6} xxl={6}>
          <SearchInput
            label="Tiêu đề"
            placeholder="Nhập tiêu đề"
            setState={setTitle}
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <Typography.Text>Danh mục</Typography.Text>
          <Select
            allowClear
            options={categoryOptions}
            placeholder="Chọn danh mục"
            onChange={(value) => setCategory(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <SearchInput
            label="Tác giả"
            placeholder="Nhập tác giả"
            setState={setAuthor}
          />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5} xl={5} xxl={5}>
          <Typography.Text>Ngày đăng</Typography.Text>
          <DatePicker
            locale={locale}
            format={'DD/MM/YYYY'}
            placeholder="Chọn ngày đăng"
            style={{ width: '100%' }}
            onChange={handleChangePublishDate}
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              onFetch={() => {
                fetchNewsList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(title, publishDate, category, author),
                  ),
                );
              }}
            />
          </Flex>
        </Col>
      </Row>
      {screenSize === 'xs' || screenSize === 'sm' ? (
        isLoading === true ? (
          <Loading />
        ) : (
          <Row gutter={[7, 20]} style={{ margin: '10px 0px' }}>
            {newsList.map((news) => {
              return (
                <Col xs={24} sm={12} key={news._id}>
                  <NewsCard
                    dataSource={news}
                    handleViewModal={() => handleModal('view', news)}
                    viewModalPermission={ALL_PERMISSIONS.NOTIFICATIONS.GET}
                    permissionList={permissionList}
                  />
                </Col>
              );
            })}
            {newsList.length > 0 && (
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
          dataSource={newsList}
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
      <CreateNewsModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchNewsList={() =>
          fetchNewsList(meta.current, meta.pageSize, '-createdAt')
        }
        categoryOptions={categoryOptions}
      />
      <ViewNewsModal
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        newsViewData={newsViewData}
        setNewsViewData={setNewsViewData}
      />
      <UpdateNewsModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        newsUpdateData={newsUpdateData}
        setNewsUpdateData={setNewsUpdateData}
        fetchNewsList={
          title || publishDate || category || author
            ? () =>
                fetchNewsList(
                  meta.current,
                  meta.pageSize,
                  '-createdAt',
                  buildQueryString(
                    queryParams(title, publishDate, category, author),
                  ),
                )
            : () => fetchNewsList(meta.current, meta.pageSize, '-createdAt')
        }
        categoryOptions={categoryOptions}
      />
    </div>
  );
};

export default News;
