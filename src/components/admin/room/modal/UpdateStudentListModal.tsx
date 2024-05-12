'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Form, Modal, Select, Typography, notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface IProps {
  isUpdateStudentListModalOpen: boolean;
  setIsUpdateStudentListModalOpen: (value: boolean) => void;
  studentListUpdateData: null | IRoom;
  setStudentListUpdateData: (value: null | IRoom) => void;
  fetchRoomList: () => void;
}

const UpdateStudentListModal = (props: IProps) => {
  const {
    isUpdateStudentListModalOpen,
    setIsUpdateStudentListModalOpen,
    studentListUpdateData,
    setStudentListUpdateData,
    fetchRoomList,
  } = props;
  const { Text } = Typography;
  const { status } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentList, setStudentList] = useState<IStudentOption[]>([]);
  const [registrationList, setRegistrationList] = useState<IRegistration[]>([]);
  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (status === 'authenticated' && studentListUpdateData) {
      const { gender, roomType } = studentListUpdateData;

      fetchStudentList(gender);
      fetchRegistrationList(gender, roomType._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, studentListUpdateData]);

  useEffect(() => {
    if (studentList && registrationList) {
      const studentListClone: string[] = [];
      const registrationListClone: string[] = [];
      const studentOptionsClone: { value: string; label: string }[] = [];

      studentList.map((student: IStudentOption) => {
        studentListClone.push(`${student.code} - ${student.fullName}`);
      });

      registrationList.map((registration: IRegistration) => {
        registrationListClone.push(
          `${registration.studentCode} - ${registration.fullName}`,
        );
      });

      const finalList: string[] = studentListClone.filter((student) =>
        registrationListClone.includes(student),
      );

      studentList.map((student: IStudentOption) => {
        studentOptionsClone.push({
          value: student._id,
          label: `${student.code} - ${student.fullName}`,
        });
      });

      const finalStudentOptions: { value: string; label: string }[] =
        studentOptionsClone.filter((option) =>
          finalList.includes(option.label),
        );

      setStudentOptions(finalStudentOptions);
    }
  }, [studentList, registrationList]);

  const fetchStudentList = async (gender: string) => {
    try {
      const res = await axiosAuth.get(
        `/students?status=Chưa xếp phòng&gender=${gender}`,
      );
      setStudentList(res?.data?.data?.result as IStudentOption[]);
    } catch (error) {
      setStudentList([]);
    }
  };

  const fetchRegistrationList = async (gender: string, roomType: string) => {
    try {
      const res = await axiosAuth.get(
        `/registrations?gender=${gender}&roomType=${roomType}`,
      );
      setRegistrationList(res?.data?.data?.result as IRegistration[]);
    } catch (error) {
      setRegistrationList([]);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateStudentListModalOpen(false);
    setStudentListUpdateData(null);
    setStudentOptions([]);
  };

  const onFinish = async (values: any) => {
    const { studentList } = values;

    const data = {
      _id: studentListUpdateData?._id,
      studentList,
    };

    try {
      setIsLoading(true);
      const res = await axiosAuth.patch(`/rooms/student-list`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Cập nhật thành công !',
          duration: 2,
        });
        setIsLoading(false);
        handleCloseUpdateModal();
        fetchRoomList();
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
    <Modal
      title="Thêm sinh viên vào phòng"
      maskClosable={false}
      centered
      open={isUpdateStudentListModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <div className="current-student-list" style={{ marginBottom: '15px' }}>
        {studentListUpdateData?.studentList?.length ? (
          <>
            <Text style={{ display: 'block', marginBottom: '5px' }}>
              Danh sách sinh viên hiện tại:
            </Text>
            {studentListUpdateData?.studentList.map((student, index) => (
              <Text key={student.code} style={{ display: 'block' }}>
                {`${index + 1}. ${student.code} - ${student.fullName}`}
              </Text>
            ))}
          </>
        ) : (
          <Text style={{ display: 'block', marginBottom: '5px' }}>
            Danh sách sinh viên hiện tại: Phòng trống !
          </Text>
        )}
      </div>
      <Form name="update-student-list" form={form} onFinish={onFinish}>
        <Form.Item<IRoom>
          label="Danh sách sinh viên"
          name="studentList"
          rules={[{ required: true, message: 'Vui lòng chọn sinh viên !' }]}
        >
          <Select
            allowClear
            mode="multiple"
            options={studentOptions}
            placeholder="Chọn sinh viên"
            maxTagCount={studentListUpdateData?.roomType?.numberOfStudents ?? 4}
            filterOption={filterOption}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateStudentListModal;
