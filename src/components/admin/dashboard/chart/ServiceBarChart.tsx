'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Col, Flex, Form, Input, Row, Select } from 'antd';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface IProps {
  title: string;
  branchList: IBranchOption[];
  monthOptions: { value: string; label: string }[];
}

const ServiceBarChart = (props: IProps) => {
  const { title, branchList, monthOptions } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [serviceData, setServiceData] = useState<{
    nameList: string[];
    serviceList: number[];
  }>();
  const [data, setData] = useState<any>();
  const [labelList, setLabelList] = useState<string[]>([]);
  const [serviceList, setServiceList] = useState<number[]>([]);
  const [branch, setBranch] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.account?.role?.name !== 'Sinh viên'
    ) {
      fetchServiceData(buildQueryString(queryParams(branch, month, year)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branch, month]);

  useEffect(() => {
    if (status === 'authenticated' && year) {
      const delayDebounceFn = setTimeout(() => {
        fetchServiceData(buildQueryString(queryParams(branch, month, year)));
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }

    if (status === 'authenticated' && !year && serviceData) {
      fetchServiceData(buildQueryString(queryParams(branch, month, year)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, year]);

  useEffect(() => {
    if (branchList) {
      const branchNameOptionsClone: { value: string; label: string }[] = [];
      branchNameOptionsClone.push({ value: 'Tất cả', label: 'Tất cả' });
      branchList.map((branch: IBranchOption) => {
        branchNameOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchNameOptions(branchNameOptionsClone);
    }
  }, [branchList]);

  useEffect(() => {
    if (serviceData) {
      setLabelList(serviceData.nameList);
      setServiceList(serviceData.serviceList);
    }
  }, [serviceData]);

  useEffect(() => {
    if (labelList && serviceList) {
      setData({
        labels: labelList,
        datasets: [
          {
            label: 'VND',
            data: serviceList,
            backgroundColor: 'rgba(153, 102, 255, 1)',
          },
        ],
      });
    }
  }, [labelList, serviceList]);

  const fetchServiceData = async (queryString?: string) => {
    if (queryString && queryString !== '') {
      try {
        const res = await axiosAuth.get(
          `/invoice-details/dashboard/service?${queryString}`,
        );
        setServiceData(res?.data?.data);
      } catch (error: any) {
        setServiceData({ nameList: [], serviceList: [] });
      }
    } else {
      try {
        const res = await axiosAuth.get(`/invoice-details/dashboard/service`);
        setServiceData(res?.data?.data);
      } catch (error: any) {
        setServiceData({ nameList: [], serviceList: [] });
      }
    }
  };

  const queryParams = (branch: string, month: string, year: string) => {
    const param: any = {};

    if (branch) param.branch = branch;
    if (month) param.month = month;
    if (year) param.year = year;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    return queryString.stringify(query);
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `${title} ${month ? `${month}/` : ''}${
          year ? year : new Date().getFullYear().toString()
        }`,
        font: {
          size: '18px',
        },
        color: '#000',
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 10000000,
      },
    },
  };

  return (
    <div className="bar-chart">
      <Flex className="search" justify="center">
        <Form name="service-bar-chart-search" form={form} layout="vertical">
          <Row gutter={[15, 10]}>
            <Col span={10}>
              <Form.Item label="Chi nhánh" name="branch">
                <Select
                  options={branchNameOptions}
                  allowClear
                  placeholder="Chọn chi nhánh"
                  onChange={(value) => setBranch(value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Tháng" name="month">
                <Select
                  options={monthOptions}
                  allowClear
                  placeholder="Chọn tháng"
                  onChange={(value) => setMonth(value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Năm" name="year">
                <Input
                  allowClear
                  placeholder="Nhập năm"
                  onChange={(event) => setYear(event.currentTarget.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Flex>
      <div className="chart">
        {data && <Bar options={options} data={data} height={400} />}
      </div>
    </div>
  );
};

export default ServiceBarChart;
