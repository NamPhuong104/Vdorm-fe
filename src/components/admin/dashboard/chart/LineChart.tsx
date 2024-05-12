'use client';

import { useAxiosAuth } from '@/util/customHook';
import { Col, Flex, Form, Input, Row, Select } from 'antd';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface IProps {
  title: string;
  branchList: IBranchOption[];
  monthOptions: { value: string; label: string }[];
}

const LineChart = (props: IProps) => {
  const { title, branchList, monthOptions } = props;
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [form] = Form.useForm();
  const [branchNameOptions, setBranchNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [revenueData, setRevenueData] = useState<{
    monthList: string[];
    revenueList: number[];
  }>();
  const [data, setData] = useState<any>();
  const [labelList, setLabelList] = useState<string[]>([]);
  const [revenueList, setRevenueList] = useState<number[]>([]);
  const [branch, setBranch] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.account?.role?.name !== 'Sinh viên'
    ) {
      fetchRevenueData(buildQueryString(queryParams(branch, month, year)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branch, month]);

  useEffect(() => {
    if (status === 'authenticated' && year) {
      const delayDebounceFn = setTimeout(() => {
        fetchRevenueData(buildQueryString(queryParams(branch, month, year)));
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }

    if (status === 'authenticated' && !year && revenueData) {
      fetchRevenueData(buildQueryString(queryParams(branch, month, year)));
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
    if (revenueData) {
      const monthList = revenueData.monthList.map((month) => {
        return `Tháng ${month}`;
      });

      setLabelList(monthList);
      setRevenueList(revenueData.revenueList);
    }
  }, [revenueData]);

  useEffect(() => {
    if (labelList && revenueList) {
      setData({
        labels: labelList,
        datasets: [
          {
            label: 'VND',
            data: revenueList,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      });
    }
  }, [labelList, revenueList]);

  const fetchRevenueData = async (queryString?: string) => {
    if (queryString && queryString !== '') {
      try {
        const res = await axiosAuth.get(
          `/invoice-details/dashboard/revenue?${queryString}`,
        );
        setRevenueData(res?.data?.data);
      } catch (error: any) {
        setRevenueData({ monthList: [], revenueList: [] });
      }
    } else {
      try {
        const res = await axiosAuth.get(`/invoice-details/dashboard/revenue`);
        setRevenueData(res?.data?.data);
      } catch (error: any) {
        setRevenueData({ monthList: [], revenueList: [] });
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
        text: `${title} ${month ? `tính từ ${month}/` : 'tính từ 01/'}${
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
    <div className="line-chart">
      <Flex className="search" justify="center">
        <Form name="line-chart-search" form={form} layout="vertical">
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
        {data && <Line options={options} data={data} height={400} />}
      </div>
    </div>
  );
};

export default LineChart;
