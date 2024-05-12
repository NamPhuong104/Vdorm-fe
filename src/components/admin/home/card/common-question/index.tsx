'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Button, Card, Col, Flex, Form, Input, Row, notification } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  data: IContentHomeCommonQuestion;
}

const HomeCommonQuestionCard = (props: IProps) => {
  const { _id, category, subCategory, contentList } = props.data;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (contentList) {
      form.setFieldsValue({
        question_1: contentList[0].question,
        question_2: contentList[1].question,
        question_3: contentList[2].question,
        question_4: contentList[3].question,
        question_5: contentList[4].question,
        question_6: contentList[5].question,
        question_7: contentList[6].question,
        question_8: contentList[7].question,
        question_9: contentList[8].question,
        question_10: contentList[9].question,
        answer_1: contentList[0].answer,
        answer_2: contentList[1].answer,
        answer_3: contentList[2].answer,
        answer_4: contentList[3].answer,
        answer_5: contentList[4].answer,
        answer_6: contentList[5].answer,
        answer_7: contentList[6].answer,
        answer_8: contentList[7].answer,
        answer_9: contentList[8].answer,
        answer_10: contentList[9].answer,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentList]);

  const onFinish = async (values: any) => {
    const {
      question_1,
      question_2,
      question_3,
      question_4,
      question_5,
      question_6,
      question_7,
      question_8,
      question_9,
      question_10,
      answer_1,
      answer_2,
      answer_3,
      answer_4,
      answer_5,
      answer_6,
      answer_7,
      answer_8,
      answer_9,
      answer_10,
    } = values;
    const data = {
      _id,
      category,
      subCategory,
      contentList: [
        {
          question: question_1.trim(),
          answer: answer_1.trim(),
        },
        {
          question: question_2.trim(),
          answer: answer_2.trim(),
        },
        {
          question: question_3.trim(),
          answer: answer_3.trim(),
        },
        {
          question: question_4.trim(),
          answer: answer_4.trim(),
        },
        {
          question: question_5.trim(),
          answer: answer_5.trim(),
        },
        {
          question: question_6.trim(),
          answer: answer_6.trim(),
        },
        {
          question: question_7.trim(),
          answer: answer_7.trim(),
        },
        {
          question: question_8.trim(),
          answer: answer_8.trim(),
        },
        {
          question: question_9.trim(),
          answer: answer_9.trim(),
        },
        {
          question: question_10.trim(),
          answer: answer_10.trim(),
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
        name={`home-common-question`}
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={[15, 10]}>
          {contentList.map((content, index) => {
            {
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
                    name={`question_${index + 1}`}
                    label={`Câu hỏi ${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: `Vui lòng nhập câu hỏi ${index + 1} !`,
                      },
                    ]}
                  >
                    <Input placeholder={`Nhập câu hỏi ${index + 1}`} />
                  </Form.Item>
                  <Form.Item
                    name={`answer_${index + 1}`}
                    label={`Câu trả lời ${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: `Vui lòng nhập câu trả lời ${index + 1} !`,
                      },
                    ]}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 3, maxRows: 3 }}
                      placeholder={`Nhập câu trả lời ${index + 1}`}
                    />
                  </Form.Item>
                </Col>
              );
            }
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

export default HomeCommonQuestionCard;
