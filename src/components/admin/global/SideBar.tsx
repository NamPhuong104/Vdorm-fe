'use client';

import { ALL_PERMISSIONS } from '@/util/permission';
import {
  faAddressBook,
  faBed,
  faBell,
  faBook,
  faBuilding,
  faChartPie,
  faChartSimple,
  faCircleInfo,
  faCity,
  faCoins,
  faFileContract,
  faFilePen,
  faGrip,
  faHome,
  faIdBadge,
  faKaaba,
  faLayerGroup,
  faList,
  faListCheck,
  faMattressPillow,
  faMoneyBill,
  faMoneyCheckDollar,
  faNoteSticky,
  faPersonWalkingArrowLoopLeft,
  faReceipt,
  faScrewdriverWrench,
  faShield,
  faSliders,
  faStar,
  faToolbox,
  faTriangleExclamation,
  faUser,
  faUserTie,
  faUsers,
  faUsersViewfinder,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Drawer, Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMediaQuery from 'use-media-antd-query';
import AccountButton from './AccountButton';

interface SideBarProps {
  open: boolean;
  onClose: () => void;
  permissionList: IPermission[];
  role: string;
}

const SideBar = (props: SideBarProps) => {
  const { permissionList, role } = props;
  const { status } = useSession();
  const pathname = usePathname();
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [open, setOpen] = useState(props.open);
  const [keySelected, setKeySelected] = useState(['']);
  const [menuContent, setMenuContent] = useState<any>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize, screenSize]);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    if (status === 'authenticated' && menuContent.length) {
      let currentRoute = pathname.split('/').pop();
      let matchingKey = '';

      if (pathname.split('/').length === 4) {
        const pathnamePartList = pathname.split('/').splice(2, 2);
        currentRoute = pathnamePartList.join('/');
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, menuContent]);

  useEffect(() => {
    if (permissionList) {
      const viewDashboard =
        permissionList.find(
          (item) =>
            item.apiPath === ALL_PERMISSIONS.DASHBOARD.COUNT_BRANCH.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.COUNT_BRANCH.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath === ALL_PERMISSIONS.DASHBOARD.COUNT_ROOM.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.COUNT_ROOM.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath ===
              ALL_PERMISSIONS.DASHBOARD.COUNT_INFRASTRUCTURE.apiPath &&
            item.method ===
              ALL_PERMISSIONS.DASHBOARD.COUNT_INFRASTRUCTURE.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath ===
              ALL_PERMISSIONS.DASHBOARD.COUNT_SERVICE_TYPE.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.COUNT_SERVICE_TYPE.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath === ALL_PERMISSIONS.DASHBOARD.COUNT_USER.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.COUNT_USER.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath === ALL_PERMISSIONS.DASHBOARD.COUNT_STUDENT.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.COUNT_STUDENT.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath ===
              ALL_PERMISSIONS.DASHBOARD.CALCULATE_REVENUE.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.CALCULATE_REVENUE.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath ===
              ALL_PERMISSIONS.DASHBOARD.CALCULATE_PROGRESS.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.CALCULATE_PROGRESS.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath ===
              ALL_PERMISSIONS.DASHBOARD.CALCULATE_SERVICE.apiPath &&
            item.method === ALL_PERMISSIONS.DASHBOARD.CALCULATE_SERVICE.method,
        ) &&
        permissionList.find(
          (item) =>
            item.apiPath ===
              ALL_PERMISSIONS.DASHBOARD.CALCULATE_MAINTENANCE.apiPath &&
            item.method ===
              ALL_PERMISSIONS.DASHBOARD.CALCULATE_MAINTENANCE.method,
        );
      const viewBranch = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.BRANCHES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.BRANCHES.GET.method,
      );
      const viewMajor = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.MAJORS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.MAJORS.GET.method,
      );
      const viewServiceType = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.SERVICE_TYPES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.SERVICE_TYPES.GET.method,
      );
      const viewRoomType = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROOM_TYPES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.ROOM_TYPES.GET.method,
      );
      const viewRoom = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROOMS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.ROOMS.GET.method,
      );
      const viewRole = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROLES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.GET.method,
      );
      const viewPermission = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.PERMISSIONS.GET.method,
      );
      const viewStudent = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STUDENTS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.STUDENTS.GET.method,
      );
      const viewStudentProfile = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STUDENT_PROFILES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.STUDENT_PROFILES.GET.method,
      );
      const viewStaffViolation = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.VIOLATIONS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.VIOLATIONS.GET.method,
      );
      const viewStudentViolation = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.VIOLATIONS.GET_STUDENT.apiPath &&
          item.method === ALL_PERMISSIONS.VIOLATIONS.GET_STUDENT.method,
      );
      const viewStaffCheckInOut = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.CHECK_IN_OUT.GET.apiPath &&
          item.method === ALL_PERMISSIONS.CHECK_IN_OUT.GET.method,
      );
      const viewStudentCheckInOut = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.CHECK_IN_OUT.GET_STUDENT.apiPath &&
          item.method === ALL_PERMISSIONS.CHECK_IN_OUT.GET_STUDENT.method,
      );
      const viewStudentInfo = permissionList.find(
        (item) =>
          item.apiPath ===
            ALL_PERMISSIONS.STUDENT_PROFILES.GET_STUDENT.apiPath &&
          item.method === ALL_PERMISSIONS.STUDENT_PROFILES.GET_STUDENT.method,
      );
      const viewUser = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.USERS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET.method,
      );
      const viewInfrastructureType = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.INFRASTRUCTURE_TYPES.GET.method,
      );
      const viewInfrastructure = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.INFRASTRUCTURES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.INFRASTRUCTURES.GET.method,
      );
      const viewMaintenance = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.MAINTENANCES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.MAINTENANCES.GET.method,
      );
      const viewStaffRegistration = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.REGISTRATIONS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.REGISTRATIONS.GET.method,
      );
      const viewStudentRegistration = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.REGISTRATIONS.GET_STUDENT.apiPath &&
          item.method === ALL_PERMISSIONS.REGISTRATIONS.GET_STUDENT.method,
      );
      const viewStaffContract = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.CONTRACTS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.CONTRACTS.GET.method,
      );
      const viewStudentContract = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.CONTRACTS.GET_STUDENT.apiPath &&
          item.method === ALL_PERMISSIONS.CONTRACTS.GET_STUDENT.method,
      );
      const viewStaffInvoice = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.INVOICES.GET.apiPath &&
          item.method === ALL_PERMISSIONS.INVOICES.GET.method,
      );
      const viewStudentInvoice = permissionList.find(
        (item) =>
          item.apiPath ===
            ALL_PERMISSIONS.INVOICE_DETAILS.GET_STUDENT.apiPath &&
          item.method === ALL_PERMISSIONS.INVOICE_DETAILS.GET_STUDENT.method,
      );
      const viewContact = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.CONTACTS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.CONTACTS.GET.method,
      );
      const viewNews = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.NEWS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.NEWS.GET.method,
      );
      const viewNotification = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.NOTIFICATIONS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.NOTIFICATIONS.GET.method,
      );
      const viewContent = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.CONTENTS.GET.apiPath &&
          item.method === ALL_PERMISSIONS.CONTENTS.GET.method,
      );
      const viewArrange = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.REGISTRATIONS.POST_ARRANGE.apiPath &&
          item.method === ALL_PERMISSIONS.REGISTRATIONS.POST_ARRANGE.method,
      );
      const viewStatisticRevenue = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STATISTIC.REVENUE.apiPath &&
          item.method === ALL_PERMISSIONS.STATISTIC.REVENUE.method,
      );
      const viewStatisticProgress = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STATISTIC.PROGRESS.apiPath &&
          item.method === ALL_PERMISSIONS.STATISTIC.PROGRESS.method,
      );
      const viewStatisticService = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STATISTIC.SERVICE.apiPath &&
          item.method === ALL_PERMISSIONS.STATISTIC.SERVICE.method,
      );
      const viewStatisticMaintenance = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STATISTIC.MAINTENANCE.apiPath &&
          item.method === ALL_PERMISSIONS.STATISTIC.MAINTENANCE.method,
      );
      const viewStatisticStudentProfile = permissionList.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.STATISTIC.STUDENT_PROFILE.apiPath &&
          item.method === ALL_PERMISSIONS.STATISTIC.STUDENT_PROFILE.method,
      );

      const menuContent = [
        ...(viewDashboard && role !== 'Sinh viên'
          ? [
              {
                label: <Link href={`/admin/dashboard`}>BẢNG ĐIỀU KHIỂN</Link>,
                key: 'dashboard',
                icon: <FontAwesomeIcon icon={faChartSimple} />,
              },
            ]
          : []),
        ...((viewStatisticRevenue ||
          viewStatisticProgress ||
          viewStatisticService ||
          viewStatisticMaintenance ||
          viewStatisticStudentProfile) &&
        role !== 'Sinh viên'
          ? [
              {
                label: 'THỐNG KÊ',
                key: 'statistic',
                icon: <FontAwesomeIcon icon={faChartPie} />,
                children: [
                  ...(viewStatisticRevenue
                    ? [
                        {
                          label: 'Doanh Thu',
                          key: 'statistic/revenue',
                          icon: <FontAwesomeIcon icon={faCoins} />,
                          route: 'statistic/revenue',
                        },
                      ]
                    : []),
                  ...(viewStatisticProgress
                    ? [
                        {
                          label: 'Thanh Toán',
                          key: 'statistic/progress',
                          icon: <FontAwesomeIcon icon={faListCheck} />,
                          route: 'statistic/progress',
                        },
                      ]
                    : []),
                  ...(viewStatisticService
                    ? [
                        {
                          label: 'Tiền Dịch Vụ',
                          key: 'statistic/service',
                          icon: <FontAwesomeIcon icon={faMoneyBill} />,
                          route: 'statistic/service',
                        },
                      ]
                    : []),
                  ...(viewStatisticMaintenance
                    ? [
                        {
                          label: 'Lượt Bảo Trì',
                          key: 'statistic/maintenance',
                          icon: <FontAwesomeIcon icon={faToolbox} />,
                          route: 'statistic/maintenance',
                        },
                      ]
                    : []),
                  ...(viewStatisticStudentProfile
                    ? [
                        {
                          label: 'Số Lượng SV',
                          key: 'statistic/student-profile',
                          icon: <FontAwesomeIcon icon={faUsersViewfinder} />,
                          route: 'statistic/student-profile',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewBranch ||
          viewMajor ||
          viewServiceType ||
          viewRoomType ||
          viewRoom ||
          viewRole ||
          viewPermission) &&
        role !== 'Sinh viên'
          ? [
              {
                label: 'DANH MỤC',
                key: 'category',
                icon: <FontAwesomeIcon icon={faList} />,
                children: [
                  ...(viewBranch
                    ? [
                        {
                          label: 'Chi Nhánh',
                          key: 'branch',
                          icon: <FontAwesomeIcon icon={faBuilding} />,
                          route: 'branch',
                        },
                      ]
                    : []),
                  ...(viewMajor
                    ? [
                        {
                          label: 'Ngành',
                          key: 'major',
                          icon: <FontAwesomeIcon icon={faBook} />,
                          route: 'major',
                        },
                      ]
                    : []),
                  ...(viewServiceType
                    ? [
                        {
                          label: 'Loại Dịch Vụ',
                          key: 'service-type',
                          icon: <FontAwesomeIcon icon={faGrip} />,
                          route: 'service-type',
                        },
                      ]
                    : []),
                  ...(viewRoomType
                    ? [
                        {
                          label: 'Loại Phòng',
                          key: 'room-type',
                          icon: <FontAwesomeIcon icon={faMattressPillow} />,
                          route: 'room-type',
                        },
                      ]
                    : []),
                  ...(viewRoom
                    ? [
                        {
                          label: 'Phòng',
                          key: 'room',
                          icon: <FontAwesomeIcon icon={faBed} />,
                          route: 'room',
                        },
                      ]
                    : []),
                  ...(viewRole
                    ? [
                        {
                          label: 'Chức vụ',
                          key: 'role',
                          icon: <FontAwesomeIcon icon={faStar} />,
                          route: 'role',
                        },
                      ]
                    : []),
                  ...(viewPermission
                    ? [
                        {
                          label: 'Quyền hạn',
                          key: 'permission',
                          icon: <FontAwesomeIcon icon={faShield} />,
                          route: 'permission',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewStudent ||
          viewStudentProfile ||
          viewStaffViolation ||
          viewStaffCheckInOut ||
          viewUser) &&
        role !== 'Sinh viên'
          ? [
              {
                label: 'NGƯỜI DÙNG',
                key: 'user',
                icon: <FontAwesomeIcon icon={faUsers} />,
                children: [
                  ...(viewUser
                    ? [
                        {
                          label: 'Nhân Viên',
                          key: 'staff',
                          icon: <FontAwesomeIcon icon={faUserTie} />,
                          route: 'staff',
                        },
                      ]
                    : []),
                  ...(viewStudent
                    ? [
                        {
                          label: 'Sinh Viên',
                          key: 'student',
                          icon: <FontAwesomeIcon icon={faUser} />,
                          route: 'student',
                        },
                      ]
                    : []),
                  ...(viewStudentProfile
                    ? [
                        {
                          label: 'Hồ Sơ SV',
                          key: 'student-profile',
                          icon: <FontAwesomeIcon icon={faIdBadge} />,
                          route: 'student-profile',
                        },
                      ]
                    : []),
                  ...(viewStaffViolation
                    ? [
                        {
                          label: 'Vi Phạm',
                          key: 'violation',
                          icon: (
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                          ),
                          route: 'violation',
                        },
                      ]
                    : []),
                  ...(viewStaffCheckInOut
                    ? [
                        {
                          label: 'Vào/Ra',
                          key: 'check-in-out',
                          icon: (
                            <FontAwesomeIcon
                              icon={faPersonWalkingArrowLoopLeft}
                            />
                          ),
                          route: 'check-in-out',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewStudentViolation ||
          viewStudentCheckInOut ||
          viewStudentInfo) &&
        role === 'Sinh viên'
          ? [
              {
                label: 'NGƯỜI DÙNG',
                key: 'user',
                icon: <FontAwesomeIcon icon={faUsers} />,
                children: [
                  ...(viewStudentCheckInOut
                    ? [
                        {
                          label: 'Thông Tin',
                          key: 'info',
                          icon: <FontAwesomeIcon icon={faCircleInfo} />,
                          route: 'info',
                        },
                      ]
                    : []),
                  ...(viewNotification
                    ? [
                        {
                          label: 'Thông Báo',
                          key: 'notification',
                          icon: <FontAwesomeIcon icon={faBell} />,
                          route: 'notification',
                        },
                      ]
                    : []),
                  ...(viewStudentCheckInOut
                    ? [
                        {
                          label: 'Vào/Ra',
                          key: 'check-in-out',
                          icon: (
                            <FontAwesomeIcon
                              icon={faPersonWalkingArrowLoopLeft}
                            />
                          ),
                          route: 'check-in-out',
                        },
                      ]
                    : []),
                  ...(viewStudentViolation
                    ? [
                        {
                          label: 'Vi Phạm',
                          key: 'violation',
                          icon: (
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                          ),
                          route: 'violation',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewInfrastructureType || viewInfrastructure || viewMaintenance) &&
        role !== 'Sinh viên'
          ? [
              {
                label: 'CƠ SỞ VẬT CHẤT',
                key: 'main-infrastructure',
                icon: <FontAwesomeIcon icon={faCity} />,
                children: [
                  ...(viewInfrastructureType
                    ? [
                        {
                          label: 'Loại CSVC',
                          key: 'infrastructure-type',
                          icon: <FontAwesomeIcon icon={faKaaba} />,
                          route: 'infrastructure-type',
                        },
                      ]
                    : []),
                  ...(viewInfrastructure
                    ? [
                        {
                          label: 'CSVC',
                          key: 'infrastructure',
                          icon: <FontAwesomeIcon icon={faLayerGroup} />,
                          route: 'infrastructure',
                        },
                      ]
                    : []),
                  ...(viewMaintenance
                    ? [
                        {
                          label: 'Đơn Bảo Trì',
                          key: 'maintenance',
                          icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
                          route: 'maintenance',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewContact || viewNews || viewNotification || viewContent) &&
        role !== 'Sinh viên'
          ? [
              {
                label: 'NỘI DUNG',
                key: 'content',
                icon: <FontAwesomeIcon icon={faNoteSticky} />,
                children: [
                  ...(viewContact
                    ? [
                        {
                          label: 'Liên Hệ',
                          key: 'contact',
                          icon: <FontAwesomeIcon icon={faAddressBook} />,
                          route: 'contact',
                        },
                      ]
                    : []),
                  ...(viewNews
                    ? [
                        {
                          label: 'Tin Tức',
                          key: 'news',
                          icon: <FontAwesomeIcon icon={faBook} />,
                          route: 'news',
                        },
                      ]
                    : []),
                  ...(viewNotification
                    ? [
                        {
                          label: 'Thông Báo',
                          key: 'notification',
                          icon: <FontAwesomeIcon icon={faBell} />,
                          route: 'notification',
                        },
                      ]
                    : []),
                  ...(viewContent
                    ? [
                        {
                          label: 'Trang Chủ',
                          key: 'home',
                          icon: <FontAwesomeIcon icon={faHome} />,
                          route: 'home',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewStaffRegistration || viewStaffContract || viewStaffInvoice) &&
        role !== 'Sinh viên'
          ? [
              {
                label: 'DỊCH VỤ',
                key: 'service',
                icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />,
                children: [
                  ...(viewStaffRegistration
                    ? [
                        {
                          label: 'Đơn Đăng Ký',
                          key: 'registration',
                          icon: <FontAwesomeIcon icon={faFilePen} />,
                          route: 'registration',
                        },
                      ]
                    : []),
                  ...(viewStaffContract
                    ? [
                        {
                          label: 'Hợp Đồng',
                          key: 'contract',
                          icon: <FontAwesomeIcon icon={faFileContract} />,
                          route: 'contract',
                        },
                      ]
                    : []),
                  ...(viewStaffInvoice
                    ? [
                        {
                          label: 'Hóa Đơn',
                          key: 'invoice',
                          icon: <FontAwesomeIcon icon={faReceipt} />,
                          route: 'invoice',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...((viewStudentRegistration ||
          viewStudentContract ||
          viewStudentInvoice) &&
        role === 'Sinh viên'
          ? [
              {
                label: 'DỊCH VỤ',
                key: 'service',
                icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />,
                children: [
                  ...(viewStudentRegistration
                    ? [
                        {
                          label: 'Đơn Đăng Ký',
                          key: 'registration',
                          icon: <FontAwesomeIcon icon={faFilePen} />,
                          route: 'registration',
                        },
                      ]
                    : []),
                  ...(viewStudentContract
                    ? [
                        {
                          label: 'Hợp Đồng',
                          key: 'contract',
                          icon: <FontAwesomeIcon icon={faFileContract} />,
                          route: 'contract',
                        },
                      ]
                    : []),
                  ...(viewStudentInvoice
                    ? [
                        {
                          label: 'Hóa Đơn',
                          key: 'invoice',
                          icon: <FontAwesomeIcon icon={faReceipt} />,
                          route: 'invoice',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(viewArrange && role !== 'Sinh viên'
          ? [
              {
                label: <Link href={`/admin/arrange`}>SẮP XẾP TỰ ĐỘNG</Link>,
                key: 'arrange',
                icon: <FontAwesomeIcon icon={faSliders} />,
              },
            ]
          : []),
      ];

      setMenuContent(menuContent);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionList]);

  let menuItems: MenuProps['items'] = menuContent.map((item: any) => {
    return {
      key: item.key,
      label: item.label,
      icon: item.icon,
      children: item.children?.map((child: any) => {
        return {
          label: <Link href={`/admin/${child.route}`}>{child.label}</Link>,
          key: child.key,
          icon: child.icon,
        };
      }),
    };
  });

  return (
    <div className="side-bar">
      {screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? (
        <Drawer
          title={<AccountButton collapse={false} />}
          width={300}
          placement={'left'}
          closeIcon={false}
          onClose={props.onClose}
          open={open}
          key={'left'}
          style={{ padding: '0px', overflow: 'auto' }}
        >
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={keySelected}
            onSelect={(e) => {
              setKeySelected([e.key]);
              () => props.onClose;
            }}
          />
        </Drawer>
      ) : (
        <Sider
          defaultCollapsed
          trigger={null}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          style={{
            height: '100vh',
          }}
        >
          <AccountButton collapse={collapsed} />
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={keySelected}
            onSelect={(e) => {
              setKeySelected([e.key]);
            }}
            style={{ zIndex: '1000' }}
          />
        </Sider>
      )}
    </div>
  );
};

export default SideBar;
