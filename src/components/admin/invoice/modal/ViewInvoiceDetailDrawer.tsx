'use client';

import { Drawer, Typography } from 'antd';

interface IProps {
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (value: boolean) => void;
  invoiceDetailViewData: null | IInvoiceDetail;
  setInvoiceDetailViewData: (value: null | IInvoiceDetail) => void;
}

const ViewInvoiceDetailDrawer = (props: IProps) => {
  const {
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    invoiceDetailViewData,
    setInvoiceDetailViewData,
  } = props;
  const { Text, Paragraph } = Typography;

  const handleCloseViewDrawer = () => {
    setIsViewDrawerOpen(false);
    setInvoiceDetailViewData(null);
  };

  const currencyFormat = (value: any) => {
    return '' + value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Drawer
      title="Thông tin chi tiết hóa đơn"
      placement="right"
      open={isViewDrawerOpen}
      onClose={handleCloseViewDrawer}
    >
      <div
        className="view-invoice-detail"
        style={{ padding: '20px', height: '100%', overflowY: 'auto' }}
      >
        <Paragraph>
          <Text strong>Thời gian: </Text>
          <Text>
            {invoiceDetailViewData?.month}/{invoiceDetailViewData?.year}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tiền phòng: </Text>
          <Text>{currencyFormat(invoiceDetailViewData?.roomFee)} VND</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tiền dịch vụ: </Text>
          <Text>{currencyFormat(invoiceDetailViewData?.serviceFee)} VND</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Tổng tiền: </Text>
          <Text>{currencyFormat(invoiceDetailViewData?.totalAmount)} VND</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Số điện: </Text>
          <Text>
            {invoiceDetailViewData?.electricityNumber === true
              ? 'Đã ghi'
              : 'Chưa ghi'}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Trạng thái: </Text>
          <Text>{invoiceDetailViewData?.status}</Text>
        </Paragraph>
        <Paragraph style={{ marginBottom: '40px' }}>
          <Paragraph strong style={{ textAlign: 'center' }}>
            Thông tin dịch vụ
          </Paragraph>
          <ul>
            {invoiceDetailViewData?.serviceInfo.map((service, index) => {
              return (
                <li key={index}>
                  <Text strong>{service?.name}: </Text>
                  <Text>
                    {`${currencyFormat(service?.amountOfMoney)} x ${
                      service?.quantity
                    } = ${currencyFormat(
                      service?.amountOfMoney * service?.quantity,
                    )} VND`}
                  </Text>
                </li>
              );
            })}
          </ul>
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default ViewInvoiceDetailDrawer;
