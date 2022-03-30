import {
  getBoardSetting,
  LeftToolPattern,
  setBoardPattern,
  setLeftSideTool,
  TBoardPattern
} from '@/store/feature/boardSlice';
import { Button, Radio } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function Header(props: any) {
  const { leftSideTool } = useSelector(getBoardSetting);

  const dispatch = useDispatch();

  const onPatternChange = (value: string) => {
    dispatch(setLeftSideTool(value));
    // bug
    dispatch(
      setBoardPattern(
        value === LeftToolPattern.board ? LeftToolPattern.line : value
      )
    );
  };

  return (
    <div className='	 py-1	 bg-secondary '>
      <Radio.Group
        defaultValue='board'
        buttonStyle='solid'
        value={leftSideTool}
        onChange={({ target: { value } }) => onPatternChange(value)}
      >
        <Radio.Button value={LeftToolPattern.board}>画板</Radio.Button>
        <Radio.Button value={LeftToolPattern.line}>画笔</Radio.Button>
        <Radio.Button value={LeftToolPattern.arrow}>箭头</Radio.Button>
        <Radio.Button value={LeftToolPattern.rect}>矩形</Radio.Button>
        <Radio.Button value={LeftToolPattern.text}>文字</Radio.Button>
        <Radio.Button value={LeftToolPattern.slect}>选中</Radio.Button>
        {/* <Radio.Button value='eraser'>橡皮擦</Radio.Button>
        <Radio.Button value='trash'>删除</Radio.Button> */}
      </Radio.Group>
    </div>
  );
}
