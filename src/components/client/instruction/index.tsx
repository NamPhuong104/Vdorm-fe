'use client';

import { sheliaFont } from '@/app/fonts/fonts';
import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import ContractProcess from './categories/ContractProcess';
import DormitoryActivities from './categories/DormitoryActivities';
import GeneralRules from './categories/GeneralRules';
import RoomOwner from './categories/RoomOwner';
import RoomRegister from './categories/RoomRegister';
import ViolationHandling from './categories/ViolationHandling';

const Instruction = () => {
  return (
    <div className={`client-instruction ${sheliaFont.variable}`}>
      <Content>
        <div className="client-instruction-content">
          <div
            className="client-instruction-thumbnail"
            style={{
              backgroundImage: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)), url(${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/instruction/instruction-01.jpg)`,
            }}
          >
            <div className="client-instruction-thumbnail-title">Hướng Dẫn</div>
          </div>
          <div className="client-instruction-main-content">
            <section className="section-1">
              <Row>
                <Col span={24}>
                  <RoomRegister />
                  <GeneralRules />
                  <RoomOwner />
                  <ViolationHandling />
                  <DormitoryActivities />
                  <ContractProcess />
                </Col>
              </Row>
            </section>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Instruction;
