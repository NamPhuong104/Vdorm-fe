import { FormInstance, Modal } from 'antd';
import dayjs from 'dayjs';

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: () => void;
  isConfirmLoading: boolean;
  form: FormInstance<any>;
}

const CreateRegistration = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, isConfirmLoading, form } =
    props;

  return (
    <Modal
      title="Thông tin đơn đăng ký"
      open={isCreateModalOpen}
      cancelText="Hủy"
      okText="Gửi"
      onCancel={setIsCreateModalOpen}
      onOk={() => form.submit()}
      confirmLoading={isConfirmLoading}
    >
      <p>
        <strong>MSSV:</strong> {form.getFieldValue('studentCode')}
      </p>
      <p>
        <strong>Họ và tên:</strong> {form.getFieldValue('fullName')}
      </p>
      <p>
        <strong>Khóa:</strong> {form.getFieldValue('course')}
      </p>
      <p>
        <strong>Ngành:</strong> {form.getFieldValue('major')?.label}
      </p>
      <p>
        <strong>Ngày sinh:</strong>{' '}
        {dayjs(form.getFieldValue('dateOfBirth')?.toString()).format(
          'DD/MM/YYYY',
        )}
      </p>
      <p>
        <strong>Giới tính:</strong> {form.getFieldValue('gender')}
      </p>
      <p>
        <strong>Email:</strong> {form.getFieldValue('email')}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {form.getFieldValue('phone')}
      </p>
      <p>
        <strong>Quê quán:</strong> {form.getFieldValue('homeTown')}
      </p>
      <p>
        <strong>Sở thích:</strong> {form.getFieldValue('hobbyList')?.join(', ')}
      </p>
      <p>
        <strong>Chi nhánh:</strong> {form.getFieldValue('branch')?.label}
      </p>
      <p>
        <strong>Loại phòng:</strong> {form.getFieldValue('roomType')?.label}
      </p>
    </Modal>
  );
};

export default CreateRegistration;
