import {
  getBoardSetting,
  setBoardPattern,
  setLeftSideTool
} from '@/store/feature/boardSlice';
import { Button, Radio } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function Header(props: any) {
  const { leftSideTool } = useSelector(getBoardSetting);

  const dispatch = useDispatch();

  const onPatternChange = (value: string) => {
    dispatch(setLeftSideTool(value));
    dispatch(setBoardPattern(value));
  };

  return (
    <div className='px-4 py-2	 bg-primary '>
      <Button>new</Button>
      <Button>save</Button>
    </div>
  );
}
