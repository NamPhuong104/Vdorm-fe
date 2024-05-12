'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Button, Card, Col, Flex, Form, Input, Row, notification } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  data: IContentHomeServiceType;
}

const HomeServiceTypeCard = (props: IProps) => {
  const { _id, category, subCategory, contentList } = props.data;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [childrenContentList, setChildrenContentList] = useState<
    {
      title: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    if (contentList) {
      form.setFieldsValue({
        title_1: contentList[1].title,
        title_2: contentList[2].title,
        title_3: contentList[3].title,
        title_4: contentList[4].title,
        title_5: contentList[5].title,
        title_6: contentList[6].title,
        mainDescription: contentList[0].description,
        description_1: contentList[1].description,
        description_2: contentList[2].description,
        description_3: contentList[3].description,
        description_4: contentList[4].description,
        description_5: contentList[5].description,
        description_6: contentList[6].description,
      });
      contentList.shift();
      setChildrenContentList(contentList);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentList]);

  const onFinish = async (values: any) => {
    const {
      title_1,
      title_2,
      title_3,
      title_4,
      title_5,
      title_6,
      mainDescription,
      description_1,
      description_2,
      description_3,
      description_4,
      description_5,
      description_6,
    } = values;
    const data = {
      _id,
      category,
      subCategory,
      contentList: [
        {
          title: 'Dịch vụ & Tiện ích',
          description: mainDescription.trim(),
        },
        {
          title: title_1.trim(),
          description: description_1.trim(),
        },
        {
          title: title_2.trim(),
          description: description_2.trim(),
        },
        {
          title: title_3.trim(),
          description: description_3.trim(),
        },
        {
          title: title_4.trim(),
          description: description_4.trim(),
        },
        {
          title: title_5.trim(),
          description: description_5.trim(),
        },
        {
          title: title_6.trim(),
          description: description_6.trim(),
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
      <Form
        name={`home-service-type`}
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="mainDescription"
          label="Mô tả chính"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mô tả chính !',
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="Nhập mô tả chính"
          />
        </Form.Item>
        <Row gutter={[15, 10]}>
          {childrenContentList &&
            childrenContentList.map((content, index) => {
              return (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={12}
                >
                  <Form.Item
                    name={`title_${index + 1}`}
                    label={`Tiêu đề ${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: `Vui lòng nhập tiêu đề ${index + 1} !`,
                      },
                    ]}
                  >
                    <Input placeholder={`Nhập tiêu đề ${index + 1}`} />
                  </Form.Item>
                  <Form.Item
                    name={`description_${index + 1}`}
                    label={`Mô tả ${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: `Vui lòng nhập mô tả ${index + 1} !`,
                      },
                    ]}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 3, maxRows: 3 }}
                      placeholder={`Nhập mô tả ${index + 1}`}
                    />
                  </Form.Item>
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
    </Card>
  );
};

export default HomeServiceTypeCard;
