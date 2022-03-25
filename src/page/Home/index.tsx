import ColorPicker from '@/components/ColorPicker';
import useClientRect from '@/Hooks/useClient';
import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { getBrushSetting } from '@/store/feature/brushSlice';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  MouseCbRetuen,
  useCanvasInit,
  useCanvasMouseMoveEvent
} from './useCanvas';

export default function Home() {
  const [canvasWrapDOM, ref] = useClientRect();

  const { canvas, ctx } = useCanvasInit(canvasWrapDOM as HTMLElement);

  const { brushWidth, brushColor } = useSelector(getBrushSetting);
  const { boardPattern } = useSelector(getBoardSetting);

  // 画笔模式
  const brush = React.useCallback(
    (ctx, curInfo, lastInfo) => {
      ctx.beginPath();
      ctx.moveTo(lastInfo.clientX, lastInfo.clientY);
      ctx.lineTo(curInfo.clientX, curInfo.clientY);

      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    },
    [brushWidth, brushColor]
  );

  const handle = React.useCallback(
    ({ ctx, curInfo, lastInfo }: MouseCbRetuen) => {
      switch (boardPattern) {
        case TBoardPattern.brush:
          brush(ctx, curInfo, lastInfo);
          break;
        default:
          break;
      }
    },
    [brush, boardPattern]
  );

  useCanvasMouseMoveEvent(
    canvas as HTMLCanvasElement,
    ctx as CanvasRenderingContext2D,
    handle
  );

  return (
    <>
      <div
        ref={ref as React.LegacyRef<HTMLDivElement>}
        style={{ height: '100%' }}
      >
        <canvas id='canvas'></canvas>
      </div>
    </>
  );
}
