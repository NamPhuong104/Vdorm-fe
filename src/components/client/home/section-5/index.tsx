'use client';

import Title from 'antd/es/typography/Title';
import AnswerButton from './AnswerButton';

interface IProps {
  data: IContentHomeCommonQuestion;
}

const Section5 = (props: IProps) => {
  const { contentList } = props.data;

  return (
    <section className="section-5">
      <div className="common-questions-container">
        <div className="common-questions-title">
          <Title level={2}>Câu hỏi thường gặp</Title>
        </div>
        <div className="common-questions-content">
          {contentList?.map((content, index) => {
            return (
              <AnswerButton
                key={index}
                question={content?.question}
                answer={content?.answer}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Section5;
