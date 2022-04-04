// import { Header as PageHeader } from '@/layout/Header';
import { Layout } from 'antd';
import * as React from 'react';
import { Header } from './Header';
import LeftSider from './LeftSider';

const { Sider, Content, Footer } = Layout;

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <div className='h-screen flex flex-col font-sans'>
      <Header />

      <div style={{ height: 'calc(100vh - 48px)' }}>
        <div className='flex  w-full h-full max-h-screen	'>
          <LeftSider />
          {props.children}
        </div>
      </div>
    </div>
  );
}
