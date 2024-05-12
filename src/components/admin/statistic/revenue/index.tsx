'use client';

import { useAxiosAuth } from '@/util/customHook';
import {
  Col,
  DatePicker,
  Flex,
  Row,
  Select,
  Typography,
  notification,
} from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { ColumnsType } from 'antd/es/table';
import { DatePickerProps, Table } from 'antd/lib';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import SearchButton from '../../global/SearchButton';
import AppTitle from '../../global/Title';

const StatisticRevenue = () => {
  const { status, data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [branchList, setBranchList] = useState<IBranchOption[]>([]);
  const [revenueList, setRevenueList] = useState<
    { month: string; year: string; revenue: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branch, setBranch] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [branchOptions, setBranchOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isDisableExportStatistic, setIsDisableExportStatistic] =
    useState<boolean>(true);
  const [fullStartTime, setFullStartTime] = useState<string | null>(null);
  const [fullEndTime, setFullEndTime] = useState<string | null>(null);
  const [isDisableEndTime, setIsDisableEndTime] = useState<boolean>(true);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session.account.role.name === 'Sinh viên'
    ) {
      redirect('/admin/info');
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBranchList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && !branch && !startTime && !endTime) {
      fetchRevenueList();
    } else if (status === 'authenticated' && (branch || startTime || endTime)) {
      fetchRevenueList(
        buildQueryString(queryParams(branch, startTime, endTime)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (branch && startTime && endTime) {
      setIsDisableExportStatistic(false);
    } else {
      setIsDisableExportStatistic(true);
    }
  }, [branch, startTime, endTime]);

  useEffect(() => {
    if (fullStartTime) {
      setIsDisableEndTime(false);
    } else {
      setIsDisableEndTime(true);
      setFullEndTime(null);
    }
  }, [fullStartTime]);

  useEffect(() => {
    if (branchList) {
      const branchOptionsClone: { value: string; label: string }[] = [];
      branchOptionsClone.push({ value: 'Tất cả', label: 'Tất cả' });
      branchList.map((branch: IBranchOption) => {
        branchOptionsClone.push({ value: branch._id, label: branch.name });
      });
      setBranchOptions(branchOptionsClone);
    }
  }, [branchList]);

  const fetchRevenueList = async (queryString?: string) => {
    if (queryString && queryString !== '') {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(
          `/invoice-details/statistic/revenue?${queryString}`,
        );
        setRevenueList(res?.data?.data?.result);
        setIsLoading(false);
      } catch (error: any) {
        setRevenueList([]);
        setIsLoading(false);
        notification.error({
          message: 'Tìm kiếm thất bại !',
          description: error?.response?.data?.message,
          duration: 2,
        });
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosAuth.get(`/invoice-details/statistic/revenue`);
        setRevenueList(res?.data?.data?.result);
        setIsLoading(false);
      } catch (error: any) {
        setRevenueList([]);
        setIsLoading(false);
        notification.error({
          message: 'Tìm kiếm thất bại !',
          description: error?.response?.data?.message,
          duration: 2,
        });
      }
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

  const queryParams = (branch: string, startTime: string, endTime: string) => {
    const param: any = {};

    if (branch) param.branch = branch;
    if (startTime) param.startTime = startTime;
    if (endTime) param.endTime = endTime;

    return param;
  };

  const buildQueryString = (params: any) => {
    const query = { ...params };

    if (query.branch) query.branch = `${query.branch}`;
    if (query.startTime) query.startTime = `${query.startTime}`;
    if (query.endTime) query.endTime = `${query.endTime}`;

    return queryString.stringify(query);
  };

  const handleChangeStartDate: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      setStartTime(dayjs(date).format('MM-YYYY'));
      setFullStartTime(dayjs(date).startOf('month').format('YYYY-MM-DD'));
      setFullEndTime('');
    } else {
      setStartTime('');
      setFullStartTime('');
    }
  };

  const handleChangeEndDate: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    if (date != null) {
      setEndTime(dayjs(date).format('MM-YYYY'));
      setFullEndTime(dayjs(date).startOf('month').format('YYYY-MM-DD'));
    } else {
      setEndTime('');
      setFullEndTime('');
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs(fullStartTime);
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: ColumnsType<{ month: string; year: string; revenue: number }> =
    [
      {
        title: 'Thời gian',
        key: 'time',
        align: 'center',
        width: '50%',
        ellipsis: true,
        render: (_, record) => {
          return `${record.month}/${record.year}`;
        },
      },
      {
        title: 'Doanh thu (VND)',
        dataIndex: 'revenue',
        key: 'revenue',
        align: 'center',
        width: '50%',
        ellipsis: true,
        render: (_, record) => {
          return currencyFormat(record.revenue);
        },
      },
    ];

  return (
    <div className="statistic-revenue-page">
      <AppTitle
        moduleName="Doanh Thu"
        isDisableExportStatistic={isDisableExportStatistic}
        exportStatisticLink={`${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/invoice-details/statistic/revenue/export?${buildQueryString(
          queryParams(branch, startTime, endTime),
        )}`}
      />
      <Row gutter={[5, 10]} align={'bottom'} style={{ margin: '5px 0px 15px' }}>
        <Col xs={24} sm={24} md={8} lg={8} xl={7} xxl={7}>
          <Typography.Text>Chi nhánh</Typography.Text>
          <Select
            allowClear
            options={branchOptions}
            placeholder="Chọn chi nhánh"
            onChange={(value) => setBranch(value)}
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <Typography.Text>Thời gian bắt đầu</Typography.Text>
          <DatePicker
            locale={locale}
            allowClear
            placeholder="Chọn thời gian bắt đầu"
            style={{ width: '100%' }}
            picker="month"
            format={'MM/YYYY'}
            onChange={handleChangeStartDate}
            value={fullStartTime ? dayjs(fullStartTime) : null}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={7} xxl={7}>
          <Typography.Text>Thời gian kết thúc</Typography.Text>
          <DatePicker
            locale={locale}
            allowClear
            placeholder="Chọn thời gian kết thúc"
            style={{ width: '100%' }}
            picker="month"
            format={'MM/YYYY'}
            onChange={handleChangeEndDate}
            value={fullEndTime ? dayjs(fullEndTime) : null}
            disabled={isDisableEndTime}
            disabledDate={disabledDate}
          />
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={3} xxl={3}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <SearchButton
              key="search"
              onFetch={() =>
                fetchRevenueList(
                  buildQueryString(queryParams(branch, startTime, endTime)),
                )
              }
              isDisable={branch && startTime && endTime ? false : true}
            />
          </Flex>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={revenueList}
        rowKey={'_id'}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        pagination={{
          total: revenueList.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
        style={{ padding: '0px 3px' }}
      />
    </div>
  );
};

export default StatisticRevenue;
