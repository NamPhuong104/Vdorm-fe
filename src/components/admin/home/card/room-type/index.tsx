'use client';

import { useAxiosAuth } from '@/util/customHook';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Form, Input, Row, notification } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IProps {
  data: IContentHomeRoomType;
}

const HomeRoomTypeCard = (props: IProps) => {
  const { _id, category, subCategory, contentList } = props.data;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstImage, setFirstImage] = useState<string>('');
  const [secondImage, setSecondImage] = useState<string>('');
  const [thirdImage, setThirdImage] = useState<string>('');
  const [fourthImage, setFourthImage] = useState<string>('');

  useEffect(() => {
    if (contentList) {
      form.setFieldsValue({
        title_1: contentList[0].title,
        title_2: contentList[1].title,
        title_3: contentList[2].title,
        title_4: contentList[3].title,
        subTitle_1: contentList[0].subTitle,
        subTitle_2: contentList[1].subTitle,
        subTitle_3: contentList[2].subTitle,
        subTitle_4: contentList[3].subTitle,
        description_1: contentList[0].description,
        description_2: contentList[1].description,
        description_3: contentList[2].description,
        description_4: contentList[3].description,
        route_1: contentList[0].route,
        route_2: contentList[1].route,
        route_3: contentList[2].route,
        route_4: contentList[3].route,
      });
      setFirstImage(contentList[0].image);
      setSecondImage(contentList[1].image);
      setThirdImage(contentList[2].image);
      setFourthImage(contentList[3].image);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentList]);

  const handleBeforeUploadImage = (file: any) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) {
      notification.error({
        message: 'Tải lên thất bại !',
        description: `Vui lòng chọn ảnh có định dạng 'png', 'jpg', 'jpeg' !`,
        duration: 2,
      });
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      notification.error({
        message: 'Tải lên thất bại !',
        description: 'Vui lòng chọn ảnh có kích thước nhỏ hơn 1MB !',
        duration: 2,
      });
    }
    return isImage && isLt1M;
  };

  const handleUploadFirstImage = async ({ file, onSuccess, onError }: any) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        folder_type: 'home',
      },
    };
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axiosAuth.post(`/contents/image`, data, config);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Tải lên thành công !',
          duration: 2,
        });
        //@ts-ignore
        setFirstImage(res?.data?.data?.fileName);
      }
    } catch (error: any) {
      notification.error({
        message: 'Tải lên thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleUploadSecondImage = async ({ file, onSuccess, onError }: any) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        folder_type: 'home',
      },
    };
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axiosAuth.post(`/contents/image`, data, config);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Tải lên thành công !',
          duration: 2,
        });
        //@ts-ignore
        setSecondImage(res?.data?.data?.fileName);
      }
    } catch (error: any) {
      notification.error({
        message: 'Tải lên thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleUploadThirdImage = async ({ file, onSuccess, onError }: any) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        folder_type: 'home',
      },
    };
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axiosAuth.post(`/contents/image`, data, config);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Tải lên thành công !',
          duration: 2,
        });
        //@ts-ignore
        setThirdImage(res?.data?.data?.fileName);
      }
    } catch (error: any) {
      notification.error({
        message: 'Tải lên thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleUploadFourthImage = async ({ file, onSuccess, onError }: any) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        folder_type: 'home',
      },
    };
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axiosAuth.post(`/contents/image`, data, config);

      if (res?.data && res?.data?.message === 'success') {
        notification.success({
          message: 'Tải lên thành công !',
          duration: 2,
        });
        //@ts-ignore
        setFourthImage(res?.data?.data?.fileName);
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
    const {
      title_1,
      title_2,
      title_3,
      title_4,
      subTitle_1,
      subTitle_2,
      subTitle_3,
      subTitle_4,
      description_1,
      description_2,
      description_3,
      description_4,
      route_1,
      route_2,
      route_3,
      route_4,
    } = values;
    const data = {
      _id,
      category,
      subCategory,
      contentList: [
        {
          image: firstImage,
          title: title_1.trim(),
          subTitle: subTitle_1.trim(),
          description: description_1.trim(),
          route: route_1.trim(),
        },
        {
          image: secondImage,
          title: title_2.trim(),
          subTitle: subTitle_2.trim(),
          description: description_2.trim(),
          route: route_2.trim(),
        },
        {
          image: thirdImage,
          title: title_3.trim(),
          subTitle: subTitle_3.trim(),
          description: description_3.trim(),
          route: route_3.trim(),
        },
        {
          image: fourthImage,
          title: title_4.trim(),
          subTitle: subTitle_4.trim(),
          description: description_4.trim(),
          route: route_4.trim(),
        },
      ],
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/contents`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
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

  return (
    <Form
      name="home-room-type"
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Row gutter={[20, 20]}>
        {contentList.map((content, index) => {
          return (
            <Col key={index} xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
              <Card
                title={`Loại phòng ${index + 1}`}
                bordered={false}
                style={{ width: 'auto' }}
              >
                <Dragger
                  accept=".png, .jpg, .jpeg"
                  maxCount={1}
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={handleBeforeUploadImage}
                  customRequest={
                    index === 0
                      ? handleUploadFirstImage
                      : index === 1
                      ? handleUploadSecondImage
                      : index === 2
                      ? handleUploadThirdImage
                      : handleUploadFourthImage
                  }
                  style={{ marginBottom: '15px' }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Chọn hoặc thả file ảnh vào đây để tải lên
                  </p>
                </Dragger>
                {firstImage && index === 0 ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${firstImage}`}
                    alt="room-type"
                    priority
                    sizes="100vw"
                    width={0}
                    height={0}
                    style={{
                      width: '100%',
                      height: '100%',
                      marginBottom: '15px',
                    }}
                  />
                ) : secondImage && index === 1 ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${secondImage}`}
                    alt="room-type"
                    priority
                    sizes="100vw"
                    width={0}
                    height={0}
                    style={{
                      width: '100%',
                      height: '100%',
                      marginBottom: '15px',
                    }}
                  />
                ) : thirdImage && index === 2 ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${thirdImage}`}
                    alt="room-type"
                    priority
                    sizes="100vw"
                    width={0}
                    height={0}
                    style={{
                      width: '100%',
                      height: '100%',
                      marginBottom: '15px',
                    }}
                  />
                ) : fourthImage && index === 3 ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${fourthImage}`}
                    alt="room-type"
                    priority
                    sizes="100vw"
                    width={0}
                    height={0}
                    style={{
                      width: '100%',
                      height: '100%',
                      marginBottom: '15px',
                    }}
                  />
                ) : (
                  content?.image && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${content?.image}`}
                      alt="room-type"
                      priority
                      sizes="100vw"
                      width={0}
                      height={0}
                      style={{
                        width: '100%',
                        height: '100%',
                        marginBottom: '15px',
                      }}
                    />
                  )
                )}
                <Form.Item
                  name={`title_${index + 1}`}
                  label="Tiêu đề"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề !' },
                  ]}
                >
                  <Input placeholder="Nhập tiêu đề" />
                </Form.Item>
                <Form.Item
                  name={`subTitle_${index + 1}`}
                  label="Tiêu đề phụ"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề phụ !' },
                  ]}
                >
                  <Input placeholder="Nhập tiêu đề" />
                </Form.Item>
                <Form.Item
                  name={`description_${index + 1}`}
                  label="Mô tả"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mô tả !',
                    },
                  ]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 4, maxRows: 4 }}
                    placeholder="Nhập mô tả"
                  />
                </Form.Item>
                <Form.Item
                  name={`route_${index + 1}`}
                  label="Đường dẫn"
                  rules={[
                    { required: true, message: 'Vui lòng nhập đường dẫn !' },
                  ]}
                >
                  <Input placeholder="Nhập đường dẫn" disabled />
                </Form.Item>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Flex style={{ flexDirection: 'row-reverse', marginTop: '20px' }}>
        <Button
          size="middle"
          type="primary"
          loading={isLoading}
          onClick={() => form.submit()}
        >
          Lưu
        </Button>
      </Flex>
    </Form>
  );
};

export default HomeRoomTypeCard;
