'use client';

import { Input, Typography } from 'antd';

interface IProps {
  label: string;
  placeholder: string;
  setState: (value: string) => void;
}

const SearchInput = (props: IProps) => {
  const { label, placeholder, setState } = props;

  return (
    <div>
      <Typography.Text>{label}</Typography.Text>
      <Input
        allowClear
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
