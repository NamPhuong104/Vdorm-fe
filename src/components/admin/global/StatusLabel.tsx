import { Typography } from 'antd';

interface IProps {
  data: any;
  type: 1 | 2 | 3;
}

const StatusLabel = (props: IProps) => {
  const { data, type } = props;

  return (
    <Typography.Text
      style={{
        padding: '5px 10px',
        backgroundColor:
          type === 1 ? '#ade3a6' : type === 2 ? '#fceab6' : '#fcbfb6',
        fontWeight: '500',
        borderRadius: '15px',
        boxShadow:
          'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '150px',
      }}
    >
      {data}
    </Typography.Text>
  );
};

export default StatusLabel;
