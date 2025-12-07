import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codestral Agent - AI Code Interpreter',
  description: 'An AI agent that writes and executes code using Codestral and E2B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm, token: { colorPrimary: '#1890ff' } }}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}