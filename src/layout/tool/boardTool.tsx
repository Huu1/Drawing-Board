import ColorPicker from '@/components/ColorPicker';
import {
  getBoardSetting,
  setBoardBgColor,
  setBoardSize
} from '@/store/feature/boardSlice';
import { Col, Input, InputNumber, Row, Slider, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LockFilled, UnlockFilled } from '@ant-design/icons';
import { debounce } from '@/utils';

const equalCalc = (n: number, maxN: number, o: number) =>
  Math.max(Math.round((n / maxN) * o), 1);

const BoardTool = () => {
  const { boardBgColor, boardSize, maxBoardSize } =
    useSelector(getBoardSetting);

  const dispatch = useDispatch();

  const [isLock, setIslock] = React.useState(true);

  const disPatchWidth = (width: number) => {
    const r = { ...boardSize };
    if (isLock) {
      r.width = width;
      r.height = equalCalc(
        width,
        maxBoardSize!.width as number,
        maxBoardSize!.height as number
      );
    } else {
      r.width = width;
    }
    dispatch(setBoardSize(r));
  };

  const disPatchHeight = (height: number) => {
    const r = { ...boardSize };
    if (isLock) {
      r.height = height;
      r.width = equalCalc(
        height,
        maxBoardSize!.height as number,
        maxBoardSize!.width as number
      );
    } else {
      r.height = height;
    }
    dispatch(setBoardSize(r));
  };

  return (
    <div className='text-white'>
      <div>画板大小</div>
      <div className='flex-1 flex '>
        <div className='flex-1 mr-4'>
          <Slider
            min={1}
            max={maxBoardSize?.width}
            value={boardSize.width}
            onChange={debounce(disPatchWidth, 60, true)}
          />
        </div>
        <div className='flex-1'>
          <Slider
            min={1}
            max={maxBoardSize?.height}
            value={boardSize.height}
            onChange={debounce(disPatchHeight, 60, true)}
          />
        </div>
      </div>
      <div className='flex-1 flex'>
        <InputNumber
          addonAfter={'px'}
          min={1}
          max={maxBoardSize?.width}
          step={20}
          value={boardSize.width}
          keyboard={false}
          onStep={(value) => disPatchWidth(value)}
          onChange={(value) => disPatchWidth(value)}
        />
        <div
          className='mx-2 cursor-pointer'
          style={{ fontSize: '16px' }}
          onClick={() => setIslock(!isLock)}
        >
          <Tooltip title={'锁定宽高比例'}>
            {isLock ? <LockFilled /> : <UnlockFilled />}
          </Tooltip>
        </div>
        <InputNumber
          addonAfter={'px'}
          min={1}
          step={20}
          keyboard={false}
          max={maxBoardSize?.height}
          value={boardSize.height}
          onStep={(value) => disPatchHeight(value)}
          onChange={(value) => disPatchHeight(value)}
        />
      </div>
      <div className='mt-4'>画板背景颜色</div>
      <div>
        <ColorPicker
          color={boardBgColor}
          onChange={(color) => dispatch(setBoardBgColor(color))}
        />
      </div>
    </div>
  );
};
BoardTool.displayName = 'BoardTool';
export default React.memo(BoardTool);
