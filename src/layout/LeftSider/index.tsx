import BrushTool from '@/page/Home/tool/brush';
import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { Radio } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

const LeftSider = () => {
  const { boardPattern } = useSelector(getBoardSetting);
  const render = () => {
    let result;
    switch (boardPattern) {
      case TBoardPattern.brush:
        result = <BrushTool />;
        break;

      default:
        break;
    }
    return result;
  };
  return <div>{render()}</div>;
};

export default React.memo(LeftSider);
