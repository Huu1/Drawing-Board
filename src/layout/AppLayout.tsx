import { Header as PageHeader } from '@/layout/Header';
import { Layout } from 'antd';
import * as React from 'react';
import LeftSider from './LeftSider';

const { Sider, Content, Footer } = Layout;

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <div
      className='h-screen flex flex-col bg-secondary'
      style={{ padding: '0 16px 16px 16px' }}
    >
      <PageHeader />
      <div className='flex flex-1'>
        <div style={{ width: '300px', marginRight: '16px' }}>
          <LeftSider />
        </div>
        <div className='flex-1 bg-gray overflow-hidden'>{props.children}</div>
      </div>
    </div>
  );
}
