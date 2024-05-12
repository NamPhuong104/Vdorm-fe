'use client';

import { axiosAuth } from '@/util/axios';
import { Flex, Form, Input, Typography, notification } from 'antd';

const { Title } = Typography;

const ContactForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (formValue: IContact) => {
    const { fullName, email, phone, content } = formValue;
    const data = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      content: content.trim(),
    };

    try {
      const res: IAxios<IResponse<any>> = await axiosAuth.post(
        `/contacts`,
        data,
      );

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Gửi liên hệ thành công !',
          duration: 2,
        });
        form.resetFields();
      }
    } catch (error: any) {
      notification.error({
        message: 'Gửi liên hệ thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <div className="contact-form">
      <Title level={2} className="contact-form-title">
        Liên hệ với chúng tôi
      </Title>
      <Form form={form} onFinish={onFinish}>
        <Form.Item<IContact>
          label="Họ và tên"
          name="fullName"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ và tên !',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<IContact>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email !',
            },
            {
              pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
              message: 'Vui lòng nhập đúng định dạng email !',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<IContact>
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại !',
            },
            {
              pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
              warningOnly: true,
              message: 'Ví dụ: 0378868686',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<IContact>
          label="Nội dung"
          name="content"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập nội dung !',
            },
            {
              pattern: /^[A-Za-zÀ-ỹ0-9,.\s]+$/,
              message: 'Vui lòng nhập nội dung không chứa ký tự đặc biệt !',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
      <Flex justify="flex-start">
        <button
          className="submit-contact-form-btn"
          onClick={() => form.submit()}
        >
          Gửi
          <svg viewBox="0 0 650 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 0h213.333v213.333h-213.333v-213.333z"
              fill="rgb(215, 33, 52)"
            />
            <path
              d="M0 405.333h213.333v213.333h-213.333v-213.333z"
              fill="rgb(215, 33, 52)"
            />
            <path
              d="M426.667 405.333h213.333v213.333h-213.333v-213.333z"
              fill="rgb(215, 33, 52)"
            />
            <path
              d="M213.333 618.667h213.333v192h-213.333v-192z"
              fill="rgb(215, 33, 52)"
            />
            <path
              d="M213.333 213.333h213.333v192h-213.333v-192z"
              fill="rgb(215, 33, 52)"
            />
            <path
              d="M0 810.667h213.333v213.333h-213.333v-213.333z"
              fill="rgb(215, 33, 52)"
            />
          </svg>
        </button>
      </Flex>
    </div>
  );
};

export default ContactForm;
