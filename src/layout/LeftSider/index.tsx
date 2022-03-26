import BrushTool from '@/page/Home/tool/brush';
import BoradTool from '@/page/Home/tool/board';
import { getBoardSetting, LeftToolPattern } from '@/store/feature/boardSlice';
import { Radio } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

const LeftSider = () => {
  const { leftSideTool } = useSelector(getBoardSetting);
  const render = () => {
    let result;
    switch (leftSideTool) {
      case LeftToolPattern.board:
        result = <BoradTool />;
        break;
      case LeftToolPattern.brush:
        result = <BrushTool />;
        break;
      default:
        break;
    }
    return result;
  };
  return <div className='bg-dark p-2 h-full rounded-sm'>{render()}</div>;
};

export default React.memo(LeftSider);
