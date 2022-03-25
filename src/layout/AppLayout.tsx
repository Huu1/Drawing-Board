import { Header as PageHeader } from '@/layout/Header';
import { Layout } from 'antd';
import * as React from 'react';
import LeftSider from './LeftSider';

const { Sider, Content } = Layout;

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <Layout className='h-screen	flex flex-col'>
      <PageHeader />
      <Layout>
        <Sider className='px-4' style={{ width: '240px' }}>
          <LeftSider />
        </Sider>
        <Content className='bg-secondary'>
          <main className='h-full'>{props.children}</main>
        </Content>
      </Layout>
    </Layout>
  );
}
