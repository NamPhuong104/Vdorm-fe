'use client';

import { useAxiosAuth } from '@/util/customHook';
import { SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Modal,
  Row,
  Table,
  Typography,
  notification,
} from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { ColumnsType } from 'antd/es/table';
import { CheckboxProps } from 'antd/lib';
import { useState } from 'react';

interface IProps {
  isArrangeAutoModalOpen: boolean;
  setIsArrangeAutoModalOpen: (value: boolean) => void;
  fetchArrangeList: () => void;
}

const settingOptions = [
  {
    label: '1. Loại phòng',
    value: 'Loại phòng',
    defaultChecked: true,
    disabled: true,
  },
  {
    label: '2. Giới tính',
    value: 'Giới tính',
    defaultChecked: true,
    disabled: true,
  },
];

const checkList = ['3. Ngành', '4. Khóa', '5. Sở thích'];

const ArrangeAutoModal = (props: IProps) => {
  const {
    isArrangeAutoModalOpen,
    setIsArrangeAutoModalOpen,
    fetchArrangeList,
  } = props;
  const axiosAuth = useAxiosAuth();
  const [isLoadingArrangeAuto, setIsLoadingArrangeAuto] =
    useState<boolean>(false);
  const [isLoadingArrangeRoom, setIsLoadingArrangeRoom] =
    useState<boolean>(false);
  const [arrangedList, setArrangedList] = useState<IRegistration[]>([]);
  const [unarrangedList, setUnarrangedList] = useState<IRegistration[]>([]);
  const [settingList, setSettingList] = useState<CheckboxValueType[]>([
    'Loại phòng',
    'Giới tính',
  ]);
  const [isSelected, setIsSelected] = useState<string | null>();

  const onChangeCheckBox: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      !isSelected && setIsSelected(e.target.name);
    } else {
      setIsSelected(null);
    }
  };

  const handleCloseArrangeAutoModal = () => {
    setIsArrangeAutoModalOpen(false);
    setArrangedList([]);
    setUnarrangedList([]);
  };

  const handleArrangeAuto = async () => {
    let data = { settingList };

    if (typeof isSelected === 'string') {
      data = {
        settingList: ['Giới tính', 'Loại phòng', isSelected.substring(3)],
      };
    }

    try {
      setIsLoadingArrangeAuto(true);
      const res = await axiosAuth.post(`/registrations/arrange-auto`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Sắp xếp thành công !',
          duration: 2,
        });
        setIsLoadingArrangeAuto(false);
        //@ts-ignore
        setArrangedList(res?.data?.data?.arrangedList);
        //@ts-ignore
        setUnarrangedList(res?.data?.data?.unarrangedList);
      }
    } catch (error: any) {
      setIsLoadingArrangeAuto(false);
      notification.error({
        message: 'Sắp xếp thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const handleArrangeRoom = async () => {
    let data = {};

    if (arrangedList.length > 0 && unarrangedList.length > 0) {
      const arrangeList = arrangedList.map((registration) => {
        return { email: registration.email, room: registration?.room?._id };
      });
      const unarrangeList = unarrangedList.map((registration) => {
        return registration.email;
      });
      data = { arrangeList, unarrangeList };
    } else if (arrangedList.length > 0) {
      const arrangeList = arrangedList.map((registration) => {
        return { email: registration.email, room: registration?.room?._id };
      });
      data = { arrangeList, unarrangeList: [] };
    } else {
      const unarrangeList = unarrangedList.map((registration) => {
        return registration.email;
      });
      data = { arrangeList: [], unarrangeList };
    }

    try {
      setIsLoadingArrangeRoom(true);
      const res = await axiosAuth.post(`/registrations/arrange-room`, data);

      if (res.data && res.data.message === 'success') {
        notification.success({
          message: 'Lưu thành công !',
          duration: 2,
        });
        setIsLoadingArrangeRoom(false);
        handleCloseArrangeAutoModal();
        fetchArrangeList();
      }
    } catch (error: any) {
      setIsLoadingArrangeRoom(false);
      notification.error({
        message: 'Lưu thất bại !',
        description: error?.response?.data?.message,
        duration: 2,
      });
    }
  };

  const arrangedColumns: ColumnsType<IRegistration> = [
    {
      title: 'MSSV',
      dataIndex: 'studentCode',
      key: 'studentCode',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Loại phòng',
      dataIndex: ['roomType', 'name'],
      key: 'roomType',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Phòng',
      dataIndex: ['room', 'code'],
      key: 'room',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Tiêu chí',
      dataIndex: 'criteria',
      key: 'criteria',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return record?.criteria?.join(', ');
      },
    },
  ];

  const unarrangedColumns: ColumnsType<IRegistration> = [
    {
      title: 'MSSV',
      dataIndex: 'studentCode',
      key: 'studentCode',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      align: 'center',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Loại phòng',
      dataIndex: ['roomType', 'name'],
      key: 'roomType',
      align: 'center',
      width: '25%',
      ellipsis: true,
    },
  ];

  return (
    <Modal
      title="Sắp xếp tự động"
      maskClosable={false}
      centered
      open={isArrangeAutoModalOpen}
      onCancel={handleCloseArrangeAutoModal}
      width={'auto'}
      style={{ margin: '30px 0px' }}
      footer={
        arrangedList.length > 0 || unarrangedList.length > 0 ? (
          <>
            <Button onClick={handleCloseArrangeAutoModal}>Hủy</Button>
            <Button
              type="primary"
              loading={isLoadingArrangeRoom}
              onClick={handleArrangeRoom}
            >
              Lưu
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCloseArrangeAutoModal}>Hủy</Button>
          </>
        )
      }
    >
      <Row>
        <Col span={18}>
          <Flex gap={5} style={{ flexDirection: 'column' }}>
            <Typography.Text>Cấu hình chung: </Typography.Text>
            <Flex>
              <Checkbox.Group
                options={settingOptions}
                value={settingList}
                style={{ marginRight: '5px' }}
              />
              {checkList.map((item) => (
                <Checkbox
                  disabled={isSelected ? isSelected !== item : false}
                  name={item}
                  key={item}
                  onChange={onChangeCheckBox}
                  style={{ marginRight: '5px' }}
                >
                  {item}
                </Checkbox>
              ))}
            </Flex>
          </Flex>
        </Col>
        <Col span={6}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <Button
              type="primary"
              size="middle"
              style={{
                fontWeight: '700',
                borderColor: 'green',
                background: 'green',
              }}
              onClick={handleArrangeAuto}
              loading={isLoadingArrangeAuto}
            >
              Sắp xếp <SettingOutlined />
            </Button>
          </Flex>
        </Col>
      </Row>
      <Divider>
        <Typography.Text strong style={{ fontSize: '16px', color: '#d72134' }}>
          {`Danh sách đã được xếp phòng: ${
            arrangedList.length > 0 ? arrangedList.length : 0
          } sinh viên`}
        </Typography.Text>
      </Divider>
      <Table
        columns={arrangedColumns}
        dataSource={arrangedList}
        rowKey={'_id'}
        loading={isLoadingArrangeAuto}
        scroll={{ y: 270, x: 'auto' }}
        style={{ padding: '0px 3px' }}
        pagination={{
          locale: { items_per_page: '/ trang' },
          total: arrangedList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
      <Divider>
        <Typography.Text
          strong
          style={{ fontSize: '16px', color: '#d72134' }}
        >{`Danh sách chưa được xếp phòng: ${
          unarrangedList.length > 0 ? unarrangedList.length : 0
        } sinh viên`}</Typography.Text>
      </Divider>
      <Table
        columns={unarrangedColumns}
        dataSource={unarrangedList}
        rowKey={'_id'}
        loading={isLoadingArrangeAuto}
        scroll={{ y: 270, x: 'auto' }}
        style={{ padding: '0px 3px' }}
        pagination={{
          locale: { items_per_page: '/ trang' },
          total: unarrangedList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
    </Modal>
  );
};

export default ArrangeAutoModal;
