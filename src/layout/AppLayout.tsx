import Header from '@/layout/Header';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AppLayout(props: Props) {
  return (
    <div className='h-screen	flex flex-col'>
      <Header></Header>
      <main className='flex-1	'>{props.children}</main>
    </div>
  );
}
