import { Button, Flex } from 'antd';
import React from 'react';

const DetailsButton = (props: { title: string; height: number }) => {
  return (
    <Flex justify="flex-end">
      <Button>{props.title}</Button>
      <svg
        className="Icon_icon__QfSMz FlagBtn_icon___qLnh"
        height={props.height}
        viewBox="0 0 650 1024"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      >
        <path
          d="M0 0h213.333v213.333h-213.333v-213.333z"
          fill="rgb(215, 33, 52)"
        />
        <path
          d="M0 405.333h213.333v213.333h-213.333v-213.333z"
          fill="rgb(215, 33, 52)"
        />
        <path
          d="M426.667 405.333h213.333v213.333h-213.333v-213.333z"
          fill="rgb(215, 33, 52)"
        />
        <path
          d="M213.333 618.667h213.333v192h-213.333v-192z"
          fill="rgb(215, 33, 52)"
        />
        <path
          d="M213.333 213.333h213.333v192h-213.333v-192z"
          fill="rgb(215, 33, 52)"
        />
        <path
          d="M0 810.667h213.333v213.333h-213.333v-213.333z"
          fill="rgb(215, 33, 52)"
        />
      </svg>
    </Flex>
  );
};

export default DetailsButton;
