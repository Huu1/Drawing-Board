// import { Header as PageHeader } from '@/layout/Header';
import { Layout } from 'antd';
import * as React from 'react';
import { Header } from './Header';
import LeftSider from './LeftSider';

const { Sider, Content, Footer } = Layout;

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <Header />
      <div className='flex-1 flex'>
        <LeftSider />
        <main className='flex-1 flex flex-col overflow-hidden' id='main'>
          <div className='bg-primary'>tool</div>
          <div className='flex-auto bg-secondary '>{props.children}</div>
        </main>
      </div>
    </div>
  );
}
