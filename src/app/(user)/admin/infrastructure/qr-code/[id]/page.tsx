'use client';

import QrCodePrintList from '@/components/admin/infrastructure/qrcode-table/qrcode-print/QrCodePrintList';

const QrCode = ({ params }: { params: { id: string } }) => {
  return <QrCodePrintList />;
};

export default QrCode;
