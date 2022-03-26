import {
  getBoardSetting,
  setBoardPattern,
  setLeftSideTool
} from '@/store/feature/boardSlice';
import { Radio } from 'antd';
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
    <div className='	px-4 py-2	 bg-secondary '>
      <Radio.Group
        defaultValue='board'
        buttonStyle='solid'
        value={leftSideTool}
        onChange={({ target: { value } }) => onPatternChange(value)}
      >
        <Radio.Button value='board'>画板</Radio.Button>
        <Radio.Button value='brush'>画笔</Radio.Button>
        <Radio.Button value='line'>直线</Radio.Button>
        {/* <Radio.Button value='recovery'>恢复</Radio.Button>
        <Radio.Button value='eraser'>橡皮擦</Radio.Button>
        <Radio.Button value='trash'>删除</Radio.Button> */}
      </Radio.Group>
    </div>
  );
}
