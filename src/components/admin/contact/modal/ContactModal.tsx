'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Typography,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  modalType: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  contactData: null | IContact;
  setContactData: (value: null | IContact) => void;
  fetchContactList: () => void;
}

const ContactModal = (props: IProps) => {
  const {
    modalType,
    isModalOpen,
    setIsModalOpen,
    contactData,
    setContactData,
    fetchContactList,
  } = props;
  const { Text, Paragraph } = Typography;
  const { TextArea } = Input;
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isDraftLoading, setIsDraftLoading] = useState<boolean>(false);
  const [isSendLoading, setIsSendLoading] = useState<boolean>(false);

  useEffect(() => {
    if (contactData) {
      form.setFieldsValue({
        fullName: contactData.fullName,
        email: contactData.email,
        phone: contactData.phone,
        content: contactData.content,
        replyContent: contactData.replyContent ?? '',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, contactData]);

  const handleCloseModal = () => {
    if (modalType !== 'view') {
      form.resetFields();
    }
    setIsModalOpen(false);
    setContactData(null);
  };

  const onDraftContact = async () => {
    const data = form.getFieldsValue();
    data._id = contactData?._id;
    data.status = 'Đang trả lời';

    try {
      setIsDraftLoading(true);
      const res = await axiosAuth.patch(`/contacts/reply`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Lưu bản nháp thành công !',
          duration: 2,
        });
        setIsDraftLoading(false);
        handleCloseModal();
        fetchContactList();
      }
    } catch (error: any) {
      setIsDraftLoading(false);
      notification.error({
        message: 'Lưu bản nháp thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const onFinish = async (values: any) => {
    const { fullName, email, phone, content, replyContent } = values;
    const data = {
      _id: contactData?._id,
      fullName,
      email,
      phone,
      content,
      replyContent: replyContent.trim(),
      status: 'Đã trả lời',
    };

    try {
      setIsSendLoading(true);
      const res = await axiosAuth.patch(`/contacts/reply`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Trả lời thành công !',
          duration: 2,
        });
        setIsSendLoading(false);
        handleCloseModal();
        fetchContactList();
      }
    } catch (error: any) {
      setIsSendLoading(false);
      notification.error({
        message: 'Trả lời thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  return (
    <>
      {modalType === 'edit' ? (
        <Modal
          title="Trả lời liên hệ"
          maskClosable={false}
          centered
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={
            <>
              <Button loading={isDraftLoading} onClick={onDraftContact}>
                Lưu nháp
              </Button>
              <Button
                type="primary"
                loading={isSendLoading}
                onClick={() => form.submit()}
              >
                Gửi
              </Button>
            </>
          }
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item<IContact> label="Họ và tên" name="fullName">
              <Input disabled />
            </Form.Item>
            <Form.Item<IContact> label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item<IContact> label="Số điện thoại" name="phone">
              <Input disabled />
            </Form.Item>
            <Form.Item<IContact> label="Câu hỏi" name="content">
              <Input disabled />
            </Form.Item>
            <Form.Item<IContact>
              label="Câu trả lời"
              name="replyContent"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập câu trả lời !',
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập câu trả lời"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Drawer
          title="Thông tin liên hệ"
          placement="right"
          open={isModalOpen}
          onClose={handleCloseModal}
        >
          <div
            className="view-contact"
            style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
          >
            <Paragraph>
              <Text strong>Họ và tên: </Text>
              <Text>{contactData?.fullName}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Email: </Text>
              <Text>{contactData?.email}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Số điện thoại: </Text>
              <Text>{contactData?.phone}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Câu hỏi: </Text>
              <Text>{contactData?.content}</Text>
            </Paragraph>
            {contactData?.replyContent && (
              <Paragraph>
                <Text strong>Câu trả lời: </Text>
                <Text>{contactData?.replyContent}</Text>
              </Paragraph>
            )}
            <Paragraph style={{ marginBottom: '40px' }}>
              <Text strong>Trạng thái: </Text>
              <Text>{contactData?.status}</Text>
            </Paragraph>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default ContactModal;
