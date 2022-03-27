import ColorPicker from '@/components/ColorPicker';
import {
  getBoardSetting,
  setBoardBgColor,
  setBoardSize
} from '@/store/feature/boardSlice';
import { Col, Row, Slider } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BoardTool = () => {
  const { boardBgColor, boardSize } = useSelector(getBoardSetting);

  const dispatch = useDispatch();

  const onSizeChange = (s: string, value: number) => {
    switch (s) {
      case 'width':
        dispatch(setBoardSize({ ...boardSize, width: value }));
        break;
      case 'height':
        dispatch(setBoardSize({ ...boardSize, height: value }));
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <div className='text-gray-300'>画板背景颜色</div>
      <Row>
        <ColorPicker
          color={boardBgColor}
          onChange={(color) => dispatch(setBoardBgColor(color))}
        />
      </Row>
    </div>
  );
};
BoardTool.displayName = 'BoardTool';
export default React.memo(BoardTool);
