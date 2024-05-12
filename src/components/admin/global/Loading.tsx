'use client';

import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '65%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <HashLoader color="#d72134" />
    </div>
  );
};

export default Loading;
