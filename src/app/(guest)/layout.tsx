'use client';

import ClientFooter from '@/components/client/global/Footer';
import ClientHeader from '@/components/client/global/Header';
import '@/styles/client/global.scss';
import '@/styles/client/homepage.scss';
import { Layout } from 'antd';
import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.scss';

const ClientLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Layout className={`client-content`}>
      <ClientHeader />
      {children}
      <ClientFooter />
    </Layout>
  );
};

export default ClientLayout;
