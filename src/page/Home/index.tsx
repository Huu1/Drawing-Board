import useDom from '@/Hooks/useDom';
import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { getBrushSetting } from '@/store/feature/brushSlice';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MouseCbRetuen,
  useCanvasInit,
  useCanvasMouseMoveEvent
} from './useCanvas';
let data: any;
export default function Home() {
  const dispatch = useDispatch();
  const { brushWidth, brushColor } = useSelector(getBrushSetting);
  const { boardPattern, boardBgColor, boardSize, canvas, ctx } =
    useSelector(getBoardSetting);

  const [canvasWrapDOM, canvasWrapDOMRef] = useDom<HTMLDivElement>();
  // const [canvasDOM, canvasRef] = useDom<HTMLCanvasElement>();

  useCanvasInit(canvasWrapDOM, dispatch);

  // 画笔模式
  const brush = React.useCallback(
    ({ ctx, curInfo, lastInfo }: MouseCbRetuen) => {
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

  // 直线
  const line = React.useCallback(
    ({ ctx, curInfo, lastInfo }: MouseCbRetuen) => {
      // data = ctx.getImageData(0, 0, canvas!.width, canvas!.height);
      // ctx.clearRect(0, 0, 600, 600);
      // ctx.moveTo(lastInfo.clientX, lastInfo.clientY);
      // ctx.lineTo(curInfo.clientX, curInfo.clientY);
      // ctx.putImageData(data, 0, 0);
      // ctx.stroke();
      // data = ctx.getImageData(0, 0, canvas!.width, canvas!.height);
      // ctx.lineCap = 'round';
      // ctx.lineJoin = 'round';
      // ctx.stroke();
    },
    [brushWidth, brushColor, canvas]
  );

  const handle = React.useCallback(
    (context: MouseCbRetuen) => {
      switch (boardPattern) {
        case TBoardPattern.brush:
          brush(context);
          break;
        case TBoardPattern.line:
          line(context);
          break;
        default:
          break;
      }
    },
    [brush, boardPattern, line]
  );

  useCanvasMouseMoveEvent(
    canvas as HTMLCanvasElement,
    ctx as CanvasRenderingContext2D,
    handle
  );

  // React.useEffect(() => {
  //   if (canvas) {
  //     const { height, width } = boardSize;
  //     canvas.setAttribute('width', width + 'px');
  //     canvas.setAttribute('height', height + 'px');
  //   }
  // }, [boardSize, canvas]);

  return (
    <>
      <div
        ref={canvasWrapDOMRef as React.LegacyRef<HTMLDivElement>}
        style={{ height: '100%' }}
        className='relative rounded-sm overflow-hidden'
      ></div>
    </>
  );
}
