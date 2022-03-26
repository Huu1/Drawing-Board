import { Header as PageHeader } from '@/layout/Header';
import { Layout } from 'antd';
import * as React from 'react';
import LeftSider from './LeftSider';

const { Sider, Content, Footer } = Layout;

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <Layout className='h-screen	flex flex-col'>
      <PageHeader />
      <Layout>
        <Sider
          className='px-4'
          width='250'
          style={{ backgroundColor: '#343a40' }}
        >
          <LeftSider />
        </Sider>
        <Content className='bg-secondary pr-3.5'>{props.children}</Content>
      </Layout>
      <Footer
        style={{ height: '16px', backgroundColor: '#343a40', padding: '0' }}
      />
    </Layout>
  );
}
