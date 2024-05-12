'use client';

import { Result } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  children: React.ReactNode;
  hideChildren?: boolean;
  permission?: { method: string; apiPath: string; module: string };
  permissionList?: IPermission[];
}

const Access = (props: IProps) => {
  const { children, hideChildren = false, permission, permissionList } = props;
  const [isAllow, setIsAllow] = useState<boolean>(true);

  useEffect(() => {
    if (permission && permissionList?.length) {
      const check = permissionList.find(
        (item) =>
          item.apiPath === permission.apiPath &&
          item.method === permission.method &&
          item.module === permission.module,
      );

      if (check) {
        setIsAllow(true);
      } else {
        setIsAllow(false);
      }
    }
  }, [permissionList, permission]);

  return (
    <>
      {isAllow === true ? (
        <>{children}</>
      ) : (
        <>
          {hideChildren === false ? (
            <Result
              status="403"
              title="Truy cập bị từ chối !"
              subTitle="Xin lỗi, bạn không có quyền hạn để truy cập thông tin này."
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Access;
