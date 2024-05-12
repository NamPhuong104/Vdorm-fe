import { IBM_Plex_Sans, Merriweather } from 'next/font/google';

import localFont from 'next/font/local';

export const sheliaFont = localFont({
  src: './MTD Adventures Unlimited Script Bold.ttf',
  display: 'swap',
  variable: '--font-shelia',
});

export const ibmFlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-ibm',
});
