'use client';

import {
  faBed,
  faBuilding,
  faGrip,
  faLayerGroup,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Flex, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import useMediaQuery from 'use-media-antd-query';

interface IProps {
  title: string;
  quantity: number;
}

const MainCard = (props: IProps) => {
  const { title, quantity } = props;
  const colSize = useMediaQuery();
  const [screenSize, setScreenSize] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenSize(colSize);
    }
  }, [colSize, screenSize]);

  return (
    <Tooltip title={title} placement="bottom">
      <Card hoverable bodyStyle={{ padding: '15px 0' }}>
        <Flex
          justify="center"
          align="center"
          gap={'5px'}
          style={{ flexDirection: 'column' }}
        >
          {screenSize !== 'xs' && (
            <Typography.Title
              level={5}
              ellipsis
              style={{
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography.Title>
          )}
          <Flex align="center" justify="center" gap={'20px'}>
            <FontAwesomeIcon
              icon={
                title === 'Chi nhánh'
                  ? faBuilding
                  : title === 'Phòng'
                  ? faBed
                  : title === 'Cơ sở vật chất'
                  ? faLayerGroup
                  : title === 'Dịch vụ'
                  ? faGrip
                  : title === 'Nhân viên'
                  ? faUserTie
                  : faUser
              }
              size={screenSize === 'xs' ? '1x' : '2x'}
              color={
                title === 'Chi nhánh' ||
                title === 'Cơ sở vật chất' ||
                title === 'Nhân viên'
                  ? '#D72134'
                  : '#2D334D'
              }
            />
            <Typography.Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
              <CountUp end={quantity} duration={3} />
            </Typography.Text>
          </Flex>
        </Flex>
      </Card>
    </Tooltip>
  );
};

export default MainCard;
