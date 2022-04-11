import { getBoardSetting } from '@/store/feature/boardSlice';
import { Button, Radio } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function Header(props: any) {
  const dispatch = useDispatch();

  return (
    <div className='px-4 py-2	 bg-primary '>
      <Button>new</Button>
      <Button>save</Button>
    </div>
  );
}
