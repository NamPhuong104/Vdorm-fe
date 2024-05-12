'use client';

import { useAxiosAuth } from '@/util/customHook';
import { FileImageOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Editor from 'ckeditor5-custom-build';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  newsUpdateData: null | INew;
  setNewsUpdateData: (value: null | INew) => void;
  fetchNewsList: () => void;
  categoryOptions: { value: string; label: string }[];
}

const UpdateNewsModal = (props: IProps) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    newsUpdateData,
    setNewsUpdateData,
    fetchNewsList,
    categoryOptions,
  } = props;
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState('');
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authorization, setAuthorization] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [thumbnailName, setThumbnailName] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    if (session?.access_token) {
      setAuthorization(session.access_token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newsUpdateData) {
      form.setFieldsValue({
        thumbnail: newsUpdateData.thumbnail,
        title: newsUpdateData.title,
        publishDate: dayjs(newsUpdateData.publishDate),
        category: newsUpdateData.category,
        author: newsUpdateData.author,
        content: newsUpdateData.content,
      });
      setThumbnail(newsUpdateData.thumbnail);
      setContent(newsUpdateData.content);
      setThumbnailName(newsUpdateData.thumbnail);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsUpdateData]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setThumbnail('');
    setContent('');
    setThumbnailName('');
    setIsUpdateModalOpen(false);
    setNewsUpdateData(null);
  };

  const handleBeforeUploadThumbnail = (file: any) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) {
      notification.error({
        message: 'Tải lên thất bài !',
        description: `Vui lòng chọn ảnh có định dạng 'png', 'jpg', 'jpeg' !`,
        duration: 2,
      });
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      notification.error({
        message: 'Tải lên thất bài !',
        description: 'Vui lòng chọn ảnh có kích thước nhỏ hơn 1MB !',
        duration: 2,
      });
    }
    return isImage && isLt1M;
  };

  const handleUploadThumbnail = async ({ file, onSuccess, onError }: any) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        folder_type: 'news',
      },
    };
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axiosAuth.post(`/news/thumbnail`, data, config);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Tải lên thành công !',
          duration: 2,
        });
        //@ts-ignore
        setThumbnail(res?.data?.data?.fileName);
        setThumbnailName(file?.name);
      }
    } catch (error: any) {
      notification.error({
        message: 'Tải lên thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const onFinish = async (values: any) => {
    const { title, publishDate, category, author } = values;
    const data = {
      _id: newsUpdateData?._id,
      thumbnail,
      title: title.trim(),
      publishDate: dayjs(publishDate).format('YYYY-MM-DD'),
      category,
      author: author.trim(),
      content,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/news`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchNewsList();
      }
    } catch (error: any) {
      setIsLoading(false);
      notification.error({
        message: 'Cập nhật thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      title="Cập nhật tin tức"
      maskClosable={false}
      centered
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
      width="80vw"
      style={{ margin: '30px 0' }}
    >
      <Form name="update-news" form={form} onFinish={onFinish}>
        <Flex gap={'20px'}>
          <div style={{ width: '50%' }}>
            <Form.Item<INew>
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề !' }]}
            >
              <Input allowClear placeholder="Nhập tiêu đề" />
            </Form.Item>
            <Form.Item<INew>
              label="Ngày đăng"
              name="publishDate"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày đăng !',
                },
              ]}
            >
              <DatePicker
                locale={locale}
                style={{ width: '100%' }}
                format={'DD/MM/YYYY'}
                allowClear
                placeholder="Chọn ngày đăng"
                placement="bottomRight"
              />
            </Form.Item>
          </div>
          <div style={{ width: screenSize === 'md' ? '50%' : '30%' }}>
            <Form.Item label="Ảnh bìa">
              <Upload
                listType="text"
                accept=".png, .jpg, .jpeg"
                maxCount={1}
                multiple={false}
                showUploadList={false}
                beforeUpload={handleBeforeUploadThumbnail}
                customRequest={handleUploadThumbnail}
              >
                <Button
                  size={'middle'}
                  style={{
                    fontSize: '15px',
                    borderColor: '#808080',
                  }}
                  icon={<FileImageOutlined />}
                >
                  Chọn ảnh bìa
                </Button>
              </Upload>
            </Form.Item>
            <Typography.Text ellipsis>{thumbnailName}</Typography.Text>
          </div>
          <div style={{ width: screenSize === 'md' ? '0' : '20%' }}>
            {thumbnail && screenSize !== 'md' && (
              <Flex align="flex-start" justify="center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/news/${thumbnail}`}
                  alt="news-thumbnail"
                  width={100}
                  height={100}
                />
              </Flex>
            )}
          </div>
        </Flex>
        <Flex gap={20}>
          <div style={{ width: '50%' }}>
            <Form.Item<INew>
              label="Danh mục"
              name="category"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục !' }]}
            >
              <Select
                allowClear
                options={categoryOptions}
                placeholder="Chọn danh mục"
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
          </div>
          <div style={{ width: '50%' }}>
            <Form.Item<INew>
              label="Tác giả"
              name="author"
              rules={[{ required: true, message: 'Vui lòng nhập tác giả !' }]}
            >
              <Input allowClear placeholder="Nhập tác giả" />
            </Form.Item>
          </div>
        </Flex>
        <Form.Item<INew>
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung !' }]}
        >
          <CKEditor
            config={{
              removePlugins: ['MediaEmbedToolbar'],
              simpleUpload: {
                uploadUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/news/image`,
                withCredentials: true,
                headers: {
                  'X-CSRF-TOKEN': 'CSRF-Token',
                  Authorization: `Bearer ${authorization}`,
                  folder_type: 'news',
                },
              },
            }}
            editor={Editor}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateNewsModal;
