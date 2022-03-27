import LineTool from '@/layout/tool/lineTool';
import BoradTool from '@/layout/tool/boardTool';
import { getBoardSetting, LeftToolPattern } from '@/store/feature/boardSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import ArrowTool from '../tool/arrowTool';

const LeftSider = () => {
  const { leftSideTool } = useSelector(getBoardSetting);
  const render = () => {
    let result;
    switch (leftSideTool) {
      case LeftToolPattern.board:
        result = <BoradTool />;
        break;
      case LeftToolPattern.line:
        result = <LineTool />;
        break;
      case LeftToolPattern.arrow:
        result = <ArrowTool />;
        break;
      default:
        break;
    }
    return result;
  };
  return <div className='bg-dark p-2 h-full rounded-sm'>{render()}</div>;
};

export default React.memo(LeftSider);
