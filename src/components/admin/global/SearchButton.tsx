import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface IProps {
  onFetch: () => void;
  isDisable?: boolean;
}

const SearchButton = ({ onFetch, isDisable }: IProps) => {
  return (
    <Button
      className="search-btn"
      type="primary"
      size={'middle'}
      style={{
        padding: '4px 18px',
        fontWeight: '600',
        background: 'green',
        borderColor: 'green',
        color: 'white',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      }}
      onClick={onFetch}
      disabled={isDisable ?? false}
    >
      TÌM KIẾM <SearchOutlined />
    </Button>
  );
};

export default SearchButton;
