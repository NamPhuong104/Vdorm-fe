'use client';

import { useAxiosAuth } from '@/util/customHook';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';
import {
  faBarsProgress,
  faBed,
  faDoorClosed,
  faDoorOpen,
  faFile,
  faHome,
  faInfo,
  faNewspaper,
  faPenToSquare,
  faRightFromBracket,
  faSchool,
  faSquareArrowUpRight,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Drawer,
  Dropdown,
  Flex,
  Menu,
  MenuProps,
  Space,
  Typography,
} from 'antd';
import { Header } from 'antd/es/layout/layout';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import CheckInOutModal from './CheckInOutModal';

const ClientHeader = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const colSize = useMediaQuery();
  const axiosAuth = useAxiosAuth();
  const [userInfo, setUserInfo] = useState<string>('');
  const [screenSize, setScreenSize] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [keySelected, setKeySelected] = useState(['']);
  const [menuContent, setMenuContent] = useState<any>([]);
  const [isCheckInOutModalOpen, setIsCheckInOutModalOpen] =
    useState<boolean>(false);
  const [isOnCamera, setIsOnCamera] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<string>('');
  const [route, setRoute] = useState<string | undefined>('');
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const accountInfo = session.account.name.split(' - ');
      const accountName = accountInfo[1].slice(0, 10);
      if (screenSize == 'xl' || screenSize == 'xxl') {
        setUserInfo(accountName + '...');
      } else {
        setUserInfo(accountInfo[1]);
      }
    }
  }, [status, session, screenSize]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize]);

  useEffect(() => {
    const currentRoute = pathname.split('/').pop();
    setRoute(currentRoute);
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      status === 'authenticated' ||
      status === 'unauthenticated' ||
      menuContent.lenght
    ) {
      let currentRoute = pathname.split('/').pop();
      let matchingKey = '';

      if (currentRoute === '') {
        setKeySelected(['home']);
      } else {
        if (pathname.split('/').length === 3) {
          const pathnamePartList = pathname.split('/').splice(1, 1);
          currentRoute = pathnamePartList[0];
        }

        menuContent.forEach((group: any) => {
          if (group.children) {
            const matchingChild = group.children.find(
              (child: any) => child.route === currentRoute,
            );
            if (matchingChild) {
              matchingKey = matchingChild.key;
            }
          } else {
            const matching = group.key === currentRoute;
            if (matching) {
              matchingKey = group.key;
            }
          }
        });

        setKeySelected(matchingKey ? [matchingKey] : ['']);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, menuContent, route]);

  useEffect(() => {
    let menuContent: any = [];

    if (status === 'unauthenticated') {
      menuContent = [
        {
          label: 'Trang Chủ',
          key: 'home',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faHome} />
          ),
          route: '',
        },
        {
          label: 'Về Chúng Tôi',
          key: 'about-us',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faSchool} />
          ),
          route: 'about-us',
        },
        {
          label: 'Tin Tức',
          key: 'news',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faNewspaper} />
          ),
          route: 'news',
        },
        {
          label: 'Dịch Vụ',
          key: 'services',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faBarsProgress} />
          ),
          route: 'services',
        },
        {
          label: 'Phòng',
          key: 'room-type',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faBed} />
          ),
          route: 'room-type',
        },
        {
          label: 'Hướng Dẫn',
          key: 'instruction',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faInfo} />
          ),
          route: 'instruction',
        },
        {
          label: 'Đăng nhập',
          key: 'sign-in',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faSquareArrowUpRight} />
          ),
          route: 'auth/sign-in',
        },
      ];
    } else if (status === 'authenticated' && userInfo) {
      menuContent = [
        {
          label: 'Trang Chủ',
          key: 'home',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faHome} />
          ),
          route: '',
        },
        {
          label: 'Về Chúng Tôi',
          key: 'about-us',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faSchool} />
          ),
          route: 'about-us',
        },
        {
          label: 'Tin Tức',
          key: 'news',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faNewspaper} />
          ),
          route: 'news',
        },
        {
          label: 'Dịch Vụ',
          key: 'services',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faBarsProgress} />
          ),
          route: 'services',
        },
        {
          label: 'Phòng',
          key: 'room-type',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faBed} />
          ),
          route: 'room-type',
        },
        {
          label: 'Hướng Dẫn',
          key: 'instruction',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faInfo} />
          ),
          route: 'instruction',
        },
        {
          label: 'Đăng Ký Phòng',
          key: 'room-register',
          icon: ['xl', 'xxl'].includes(screenSize) ? (
            ''
          ) : (
            <FontAwesomeIcon icon={faPenToSquare} />
          ),
          route: 'room-register',
        },
        ['xl', 'xxl'].includes(screenSize)
          ? {
              label: (
                <Dropdown menu={{ items, onClick }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <FontAwesomeIcon icon={faUserAlt} />
                      <span>{userInfo}</span>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              ),
              key: '7',
              icon: '',
              route: '',
            }
          : session?.account?.role?.name !== 'Sinh viên'
          ? {
              label: userInfo,
              key: '8',
              icon: <FontAwesomeIcon icon={faUserAlt} />,
              route: '',
              children: [
                {
                  label: <Link href="admin/dashboard">Trang Quản Trị</Link>,
                  key: '9',
                  icon: <FontAwesomeIcon icon={faFile} />,
                  route: '',
                },
                {
                  label: 'Đăng Xuất',
                  key: '12',
                  icon: <FontAwesomeIcon icon={faRightFromBracket} />,
                  route: '',
                },
              ],
            }
          : {
              label: userInfo,
              key: '8',
              icon: <FontAwesomeIcon icon={faUserAlt} />,
              route: '',
              children: [
                {
                  label: <Link href="admin/info">Hồ Sơ Cá Nhân</Link>,
                  key: '9',
                  icon: <FontAwesomeIcon icon={faFile} />,
                  route: 'info',
                },
                {
                  label: 'Check In',
                  key: '10',
                  icon: <FontAwesomeIcon icon={faDoorOpen} />,
                  route: '',
                },
                {
                  label: 'Check Out',
                  key: '11',
                  icon: <FontAwesomeIcon icon={faDoorClosed} />,
                  route: '',
                },
                {
                  label: 'Đăng Xuất',
                  key: '12',
                  icon: <FontAwesomeIcon icon={faRightFromBracket} />,
                  route: '',
                },
              ],
            },
      ];
    }

    setMenuContent(menuContent);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize, status, userInfo]);

  const handleSignOut = async () => {
    try {
      await axiosAuth.post(`/auth/logout`);
    } catch (error) {
      console.log(error);
    }

    signOut({ callbackUrl: `/` });
  };

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  const handleCheckInOut = (cameraType: string) => {
    setCameraType(cameraType);
    setIsOnCamera(true);
    setIsCheckInOutModalOpen(true);
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '2-1') {
      router.push('/admin/info');
    } else if (key === '2-2') {
      handleCheckInOut('in');
    } else if (key === '2-3') {
      handleCheckInOut('out');
    } else if (key === '3') {
      handleSignOut();
    }
  };

  const items: MenuProps['items'] = [
    session?.account?.role?.name !== 'Sinh viên'
      ? {
          label: <Link href="/admin/dashboard">Trang Quản Trị</Link>,
          key: '1',
        }
      : {
          label: 'Danh Mục',
          key: '2',
          type: 'group',
          children: [
            {
              key: '2-1',
              label: <Link href="/admin/info">Hồ Sơ Cá Nhân</Link>,
            },
            {
              key: '2-2',
              label: 'Check In',
            },
            {
              key: '2-3',
              label: 'Check Out',
            },
          ],
        },
    {
      label: 'Đăng Xuất',
      key: '3',
    },
  ];

  const menuItems: MenuProps['items'] = menuContent.map((item: any) => {
    if (item.key === '7') {
      return {
        key: item.key,
        label: item.label,
        icon: item.icon,
        children: item.children?.map((child: any) => {
          return {
            label: child.label,
            key: child.key,
            icon: child.icon,
          };
        }),
      };
    }

    return {
      key: item.key,
      label: <Link href={`/${item.route}`}>{item.label}</Link>,
      icon: item.icon,
      children: item.children?.map((child: any) => {
        return {
          label: child.label,
          key: child.key,
          icon: child.icon,
        };
      }),
    };
  });

  return (
    <Header
      id="clientHeader"
      className={`client-header ${scrollPosition > 30 ? 'scrolled' : ''}`}
    >
      <Link href={'/'}>
        <Flex align="center">
          <Image
            quality={100}
            width={
              screenSize === 'md'
                ? 35
                : screenSize === 'sm'
                ? 35
                : screenSize === 'xs'
                ? 30
                : 45
            }
            height={
              screenSize === 'md'
                ? 35
                : screenSize === 'sm'
                ? 35
                : screenSize === 'xs'
                ? 30
                : 45
            }
            src="/logo.svg"
            priority={true}
            alt="logo"
            style={{ cursor: 'pointer' }}
          />
          <Typography.Text
            style={{
              padding: '0px 10px',
              color: '#fff',
              fontSize:
                screenSize === 'md'
                  ? 20
                  : screenSize === 'sm'
                  ? 18
                  : screenSize === 'xs'
                  ? 15
                  : 25,
              fontWeight: 600,
              letterSpacing: '1px',
              cursor: 'pointer',
            }}
          >
            VDORM
          </Typography.Text>
        </Flex>
      </Link>
      {['xs', 'sm', 'md', 'lg'].includes(screenSize) ? (
        <>
          <Button
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          />
          <Drawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <Menu
              mode="inline"
              items={menuItems}
              selectedKeys={keySelected}
              onSelect={(e) => {
                setKeySelected([e.key]);
              }}
              onClick={(e) => {
                e.key === '10' && handleCheckInOut('in');
                e.key === '11' && handleCheckInOut('out');
                e.key === '12' && handleSignOut();
              }}
            />
          </Drawer>
        </>
      ) : (
        <>
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={keySelected}
            onSelect={(e) => {
              e.key !== '7' && setKeySelected([e.key]);
            }}
          />
        </>
      )}
      <CheckInOutModal
        isCheckInOutModalOpen={isCheckInOutModalOpen}
        setIsCheckInOutModalOpen={setIsCheckInOutModalOpen}
        isOnCamera={isOnCamera}
        setIsOnCamera={setIsOnCamera}
        cameraType={cameraType}
      />
    </Header>
  );
};

export default ClientHeader;
