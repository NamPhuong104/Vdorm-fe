'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Col, Row } from 'antd';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainCard from './card/MainCard';
import LineChart from './chart/LineChart';
import MaintenanceBarChart from './chart/MaintenanceBarChart';
import PieChart from './chart/PieChart';
import ServiceBarChart from './chart/ServiceBarChart';

const monthOptions: { value: string; label: string }[] = [
  {
    value: '01',
    label: '01',
  },
  {
    value: '02',
    label: '02',
  },
  {
    value: '03',
    label: '03',
  },
  {
    value: '04',
    label: '04',
  },
  {
    value: '05',
    label: '05',
  },
  {
    value: '06',
    label: '06',
  },
  {
    value: '07',
    label: '07',
  },
  {
    value: '08',
    label: '08',
  },
  {
    value: '09',
    label: '09',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '11',
    label: '11',
  },
  {
    value: '12',
    label: '12',
  },
];

const Dashboard = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [branchQuantity, setBranchQuantity] = useState<number>(0);
  const [roomQuantity, setRoomQuantity] = useState<number>(0);
  const [infrastructureQuantity, setInfrastructureQuantity] =
    useState<number>(0);
  const [serviceQuantity, setServiceQuantity] = useState<number>(0);
  const [userQuantity, setUserQuantity] = useState<number>(0);
  const [studentQuantity, setStudentQuantity] = useState<number>(0);
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session.account.role.name === 'Sinh viên'
    ) {
      redirect('/admin/info');
    }
  }, [status, session]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.account?.role?.name === 'Sinh viên'
    ) {
      redirect('/admin/check-in-out');
    } else if (
      status === 'authenticated' &&
      session?.account?.role?.name !== 'Sinh viên'
    ) {
      fetchBranchQuantity();
      fetchRoomQuantity(),
        fetchInfrastructureQuantity(),
        fetchServiceQuantity(),
        fetchUserQuantity(),
        fetchStudentQuantity(),
        fetchBranchList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchBranchQuantity = async () => {
    try {
      const res = await axiosAuth.get(`/branches/dashboard`);
      setBranchQuantity(res?.data?.data?.count);
    } catch (error) {
      setBranchQuantity(0);
    }
  };

  const fetchRoomQuantity = async () => {
    try {
      const res = await axiosAuth.get(`/rooms/dashboard`);
      setRoomQuantity(res?.data?.data?.count);
    } catch (error) {
      setRoomQuantity(0);
    }
  };

  const fetchInfrastructureQuantity = async () => {
    try {
      const res = await axiosAuth.get(`/infrastructures/dashboard`);
      setInfrastructureQuantity(res?.data?.data?.count);
    } catch (error) {
      setInfrastructureQuantity(0);
    }
  };

  const fetchServiceQuantity = async () => {
    try {
      const res = await axiosAuth.get(`/service-types/dashboard`);
      setServiceQuantity(res?.data?.data?.count);
    } catch (error) {
      setServiceQuantity(0);
    }
  };

  const fetchUserQuantity = async () => {
    try {
      const res = await axiosAuth.get(`/users/dashboard`);
      setUserQuantity(res?.data?.data?.count);
    } catch (error) {
      setUserQuantity(0);
    }
  };

  const fetchStudentQuantity = async () => {
    try {
      const res = await axiosAuth.get(`/students/dashboard`);
      setStudentQuantity(res?.data?.data?.count);
    } catch (error) {
      setStudentQuantity(0);
    }
  };

  const fetchBranchList = async () => {
    try {
      const res = await axiosAuth.get(`/branches`);
      setBranchList(res?.data?.data?.result as IBranchOption[]);
    } catch (error) {
      setBranchList([]);
    }
  };

  return (
    <div className="dashboard-page">
      <Row align={'top'} style={{ marginLeft: '10px', marginBottom: '20px' }}>
        <Col span={24}>
          <h2
            style={{
              fontSize: '25px',
              fontWeight: 700,
            }}
          >
            Bảng Điều Khiển
          </h2>
        </Col>
      </Row>
      <Row gutter={[20, 20]} align={'bottom'} style={{ margin: '5px 0px' }}>
        <Col xs={8} sm={8} md={8} lg={8} xl={4} xxl={4}>
          <MainCard title="Chi nhánh" quantity={branchQuantity} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={4} xxl={4}>
          <MainCard title="Phòng" quantity={roomQuantity} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={4} xxl={4}>
          <MainCard title="Cơ sở vật chất" quantity={infrastructureQuantity} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={4} xxl={4}>
          <MainCard title="Dịch vụ" quantity={serviceQuantity} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={4} xxl={4}>
          <MainCard title="Nhân viên" quantity={userQuantity} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={4} xxl={4}>
          <MainCard title="Sinh viên" quantity={studentQuantity} />
        </Col>
      </Row>
      <Row gutter={[30, 20]} style={{ margin: '40px 0px' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <LineChart
            title="Biểu đồ thống kê doanh thu"
            branchList={branchList}
            monthOptions={monthOptions}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <PieChart
            title="Biểu đồ thống kê tiến độ thanh toán hóa đơn"
            branchList={branchList}
            monthOptions={monthOptions}
          />
        </Col>
      </Row>
      <Row gutter={[30, 20]} style={{ margin: '40px 0px 20px' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <ServiceBarChart
            title="Biểu đồ thống kê tiền dịch vụ"
            branchList={branchList}
            monthOptions={monthOptions}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <MaintenanceBarChart
            title="Biểu đồ thống kê lượt bảo trì"
            branchList={branchList}
            monthOptions={monthOptions}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
