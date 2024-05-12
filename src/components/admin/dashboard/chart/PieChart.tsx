'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Col, Flex, Form, Input, Row, Select } from 'antd';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  title: string;
  branchList: IBranchOption[];
  monthOptions: { value: string; label: string }[];
}

const PieChart = (props: IProps) => {
  const { title, branchList, monthOptions } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [progressData, setProgressData] = useState<{
    unpaidRate: number;
    paidRate: number;
  }>();
  const [data, setData] = useState<any>();
  const [branch, setBranch] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.account?.role?.name !== 'Sinh viên'
    ) {
      fetchProgressData(buildQueryString(queryParams(branch, month, year)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branch, month]);

  useEffect(() => {
    if (status === 'authenticated' && year) {
      const delayDebounceFn = setTimeout(() => {
        fetchProgressData(buildQueryString(queryParams(branch, month, year)));
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }

    if (status === 'authenticated' && !year && progressData) {
      fetchProgressData(buildQueryString(queryParams(branch, month, year)));
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
    if (progressData) {
      const { unpaidRate, paidRate } = progressData;

      const noRate = unpaidRate === 0 && paidRate === 0 ? 100 : 0;

      setData({
        labels: ['Chưa thanh toán', 'Đã thanh toán', 'Không có dữ liệu'],
        datasets: [
          {
            label: 'Tỉ lệ %',
            data: [unpaidRate, paidRate, noRate],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 206, 86, 0.7)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 0,
          },
        ],
      });
    }
  }, [progressData]);

  const fetchProgressData = async (queryString?: string) => {
    if (queryString && queryString !== '') {
      try {
        const res = await axiosAuth.get(
          `/invoice-details/dashboard/progress?${queryString}`,
        );
        setProgressData(res?.data?.data);
      } catch (error: any) {
        setProgressData({ unpaidRate: 0, paidRate: 0 });
      }
    } else {
      try {
        const res = await axiosAuth.get(`/invoice-details/dashboard/progress`);
        setProgressData(res?.data?.data);
      } catch (error: any) {
        setProgressData({ unpaidRate: 0, paidRate: 0 });
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
  };

  return (
    <div className="pie-chart">
      <Flex className="search" justify="center">
        <Form name="pie-chart-search" form={form} layout="vertical">
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
        {data && <Pie options={options} data={data} height={400} />}
      </div>
    </div>
  );
};

export default PieChart;
