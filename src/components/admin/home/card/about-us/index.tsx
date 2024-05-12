'use client';

import { useAxiosAuth } from '@/util/customHook';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, notification } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IProps {
  data: IContentHomeAboutUs;
}

const HomeAboutUsCard = (props: IProps) => {
  const { _id, category, subCategory, contentList } = props.data;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    form.setFieldsValue({
      firstParagraph: contentList[0].firstParagraph,
      secondParagraph: contentList[0].secondParagraph,
    });
    setImage(contentList[0].image);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleUploadImage = async ({ file, onSuccess, onError }: any) => {
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
        setImage(res?.data?.data?.fileName);
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
    const { firstParagraph, secondParagraph } = values;
    const data = {
      _id,
      category,
      subCategory,
      contentList: [
        {
          image: image,
          firstParagraph: firstParagraph.trim(),
          secondParagraph: secondParagraph.trim(),
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
    <Card bordered={false} style={{ width: 'auto' }}>
      <Dragger
        accept=".png, .jpg, .jpeg"
        maxCount={1}
        multiple={false}
        showUploadList={false}
        beforeUpload={handleBeforeUploadImage}
        customRequest={handleUploadImage}
        style={{ marginBottom: '20px' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Chọn hoặc thả file ảnh vào đây để tải lên
        </p>
      </Dragger>
      {image ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${image}`}
          alt="about-us"
          priority
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: '100%', height: '100%', marginBottom: '15px' }}
        />
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/home/${contentList[0].image}`}
          alt="about-us"
          priority
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: '100%', height: '100%', marginBottom: '15px' }}
        />
      )}
      <Form
        name={`home-about-us`}
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Đoạn 1"
          name="firstParagraph"
          rules={[{ required: true, message: 'Vui lòng nhập đoạn 1 !' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="Nhập đoạn 1"
          />
        </Form.Item>
        <Form.Item
          label="Đoạn 2"
          name="secondParagraph"
          rules={[{ required: true, message: 'Vui lòng nhập đoạn 2 !' }]}
          style={{ textAlign: 'justify' }}
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="Nhập đoạn 2"
            style={{ textAlign: 'justify' }}
          />
        </Form.Item>
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
    </Card>
  );
};

export default HomeAboutUsCard;
