'use client';

import { useAxiosAuth } from '@/util/customHook';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Flex,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { signOut, useSession } from 'next-auth/react';

interface IProps {
  collapse: boolean;
}

const AccountButton = (props: IProps) => {
  const { collapse } = props;
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();

  const handleSignOut = async () => {
    try {
      await axiosAuth.post(`/auth/logout`);
    } catch (error) {
      console.log(error);
    }

    signOut({ callbackUrl: `/` });
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <Typography.Text ellipsis>
          {session?.account?.email ?? ''}
        </Typography.Text>
      ),
      key: '1',
    },
    {
      label: 'Đăng xuất',
      key: '2',
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];

  return (
    <>
      {collapse ? (
        <Flex style={{ height: '70px' }} align="center" justify="center">
          <Dropdown menu={{ items }}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ backgroundColor: 'rgb(215, 33, 52)' }}
            />
          </Dropdown>
        </Flex>
      ) : (
        <Row className="avatar" gutter={8} style={{ alignItems: 'center' }}>
          <Col span={5}>
            <Avatar
              size="default"
              icon={<UserOutlined />}
              style={{ backgroundColor: 'rgb(215, 33, 52)' }}
            />
          </Col>
          <Col span={15}>
            <Flex vertical>
              <Tooltip placement="bottom" title={session?.account?.email ?? ''}>
                <Typography.Text ellipsis>
                  {session?.account?.email ?? ''}
                </Typography.Text>
              </Tooltip>
              <Typography.Text ellipsis>
                {session?.account?.role.name ?? ''}
              </Typography.Text>
            </Flex>
          </Col>
          <Col span={4}>
            <Button
              danger
              size="small"
              shape="circle"
              icon={<LogoutOutlined />}
              onClick={handleSignOut}
              title="Đăng Xuất"
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default AccountButton;
