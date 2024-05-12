'use client';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';

interface IProps {
  question: string;
  answer: string;
}

const AnswerButton = (props: IProps) => {
  const { question, answer } = props;
  const [isAnswerShow, setIsAnswerShow] = useState(false);

  return (
    <div
      className="answer-container"
      onClick={() => setIsAnswerShow(!isAnswerShow)}
    >
      <div className="question">
        <Title level={3}>{question}</Title>
        {isAnswerShow ? (
          <FontAwesomeIcon icon={faMinus} />
        ) : (
          <FontAwesomeIcon icon={faPlus} />
        )}
      </div>
      <div className={`answer ${isAnswerShow ? 'showed' : ''}`}>
        <span>{answer}</span>
      </div>
    </div>
  );
};

export default AnswerButton;
