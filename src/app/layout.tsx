import StyledComponentsRegistry from '@/lib/AntdRegistry';
import NProgressWrapper from '@/lib/NProgressWrapper';
import NextAuthWrapper from '@/lib/NextAuthWrapper';
import '@/styles/ckeditor.scss';
import '@/styles/global.scss';
import '@/styles/reset.scss';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import 'normalize.css';
import React from 'react';

config.autoAddCss = false;

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
});

export const metadata = {
  title: 'VDORM | Ký túc xá Trường Đại học Văn Lang',
  description:
    'Ký túc xá Trường Đại học Văn Lang hướng đến phong cách năng động, tự chủ, tôn vinh lối sống độc lập và màu sắc riêng của từng sinh viên trong cộng đồng Văn Lang. Hứa hẹn không chỉ là nơi để ở mà còn là nơi nâng tầm chất lượng cuộc sống của sinh viên trong thời gian học tập tại VLU.',
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en" className={`${jakarta.variable}`}>
    <body>
      <StyledComponentsRegistry>
        <NProgressWrapper>
          <NextAuthWrapper>{children}</NextAuthWrapper>
        </NProgressWrapper>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
