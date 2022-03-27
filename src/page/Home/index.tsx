import useDom from '@/Hooks/useDom';
import { KonvaArrow, KonvaLine, KonvaRect } from '@/konva-components/Shpe';
import {
  getBoardSetting,
  setBoardSize,
  setScale,
  TBoardPattern
} from '@/store/feature/boardSlice';
import { getLineStyle, LinePattern } from '@/store/feature/lineSlice';
import { debounce, windowToCurrentPos } from '@/utils';
import { KonvaEventObject } from 'konva/lib/Node';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { LineConfig } from 'konva/lib/shapes/Line';
import { RectConfig } from 'konva/lib/shapes/Rect';
import * as React from 'react';
import { Stage, Layer, Text, Rect } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const isDrawing = React.useRef(false);
  const containerRef = React.useRef<any>();
  const [tool, setTool] = React.useState('pen');
  const [lines, setLines] = React.useState<LineConfig[]>([]);
  const [arrows, setArrows] = React.useState<ArrowConfig[]>([]);
  const [rects, setRect] = React.useState<RectConfig[]>([]);
  const [isMounted, Mounted] = React.useState(false);

  const { strokeWidth, stroke, dash, linePattrn } = useSelector(getLineStyle);
  const { boardPattern, boardBgColor, boardSize, scale } =
    useSelector(getBoardSetting);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      setBoardSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      })
    );

    Mounted(true);
  }, [dispatch]);

  const handleMouseDown = React.useCallback(
    (e: any) => {
      isDrawing.current = true;
      const point = e.target.getStage().getPointerPosition();

      switch (boardPattern) {
        case TBoardPattern.line:
          setLines((p: any[]) => [...p, { tool, points: [point.x, point.y] }]);
          break;
        case TBoardPattern.arrow:
          setArrows((p: any[]) => [...p, { tool, points: [point.x, point.y] }]);
          break;
        case TBoardPattern.rect:
          setRect((p: any[]) => [...p, { tool, x: point.x, y: point.y }]);
          break;
        default:
          break;
      }
    },
    [boardPattern, tool]
  );

  const lineMoveChange = React.useCallback(
    (point) => {
      setLines((lines: any[]) => {
        let lastLine = lines[lines.length - 1];
        lastLine.stroke = stroke;
        lastLine.strokeWidth = strokeWidth;
        // add point
        switch (linePattrn) {
          case LinePattern.line:
            lastLine.lineCap = 'round';
            lastLine.lineJoin = 'round';
            lastLine.points = lastLine.points.concat([point.x, point.y]);
            break;
          case LinePattern.dash:
          case LinePattern.straight:
            console.log('xxxx');

            linePattrn === LinePattern.dash && (lastLine.dash = dash);
            lastLine.lineCap = 'butt';
            lastLine.lineJoin = 'round';
            lastLine.points = [
              lastLine.points[0],
              lastLine.points[1],
              point.x,
              point.y
            ];
            break;

          default:
            break;
        }
        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        return lines.concat();
      });
    },
    [dash, linePattrn, stroke, strokeWidth]
  );

  const arrowMoveChange = React.useCallback(
    (point) => {
      setArrows((arrows: any[]) => {
        let lastArrow = arrows[arrows.length - 1];
        lastArrow.stroke = stroke;
        lastArrow.strokeWidth = strokeWidth;
        lastArrow.pointerLength = 20;
        lastArrow.pointerWidth = 20;
        lastArrow.points = [
          lastArrow.points[0],
          lastArrow.points[1],
          point.x,
          point.y
        ];
        // replace last
        arrows.splice(arrows.length - 1, 1, lastArrow);
        return arrows.concat();
      });
    },
    [stroke, strokeWidth]
  );

  const rectMoveChange = React.useCallback(
    (point) => {
      console.log('xxx');

      setRect((rects: any[]) => {
        let last = rects[rects.length - 1];
        last.fill = stroke;
        last.strokeWidth = strokeWidth;
        last.width = point.x - last.x;
        last.height = point.y - last.y;
        // replace last
        rects.splice(rects.length - 1, 1, last);
        return rects.concat();
      });
    },
    [stroke, strokeWidth]
  );

  const handleMouseMove = React.useCallback(
    (e: any) => {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const point = e.target.getStage().getPointerPosition();
      switch (boardPattern) {
        // 线
        case TBoardPattern.line:
          lineMoveChange(point);
          break;
        // 箭头
        case TBoardPattern.arrow:
          arrowMoveChange(point);
          break;
        // 矩形
        case TBoardPattern.rect:
          rectMoveChange(point);
          break;
        default:
          break;
      }
    },
    [arrowMoveChange, boardPattern, lineMoveChange, rectMoveChange]
  );

  const handleMouseUp = React.useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    isDrawing.current = false;
  }, []);

  const onWheel = (e: any) => {
    if (e.evt?.deltaY) {
      const { layerX, layerY } = e.evt;
      const transformOrigin = `${layerX}px ${layerY}px`;

      //判断浏览器IE，谷歌滑轮事件
      if (e.evt.deltaY > 0) {
        if (scale > 0.25) {
          // window.requestAnimationFrame(() => {
          containerRef.current.style.transformOrigin = transformOrigin;
          containerRef.current.style.transform = `scale(${scale - 0.25})`;
          // });
          dispatch(setScale(scale - 0.25));
        }
      }
      if (e.evt.deltaY < 0) {
        if (scale < 1.25) {
          // window.requestAnimationFrame(() => {
          containerRef.current.style.transformOrigin = transformOrigin;
          containerRef.current.style.transform = `scale(${scale + 0.25})`;
          // });
          dispatch(setScale(scale + 0.25));
        }
      }
    }
  };

  return (
    <div ref={containerRef} className='relative h-full rounded-sm '>
      {isMounted && (
        <Stage
          width={boardSize.width}
          height={boardSize.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={onWheel}
          className='page-shadow'
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={boardSize.width}
              height={boardSize.height}
              fill={boardBgColor}
              shadowBlur={10}
            />
          </Layer>
          <Layer>
            <Text text='Just start drawing' x={5} y={30} />
            <KonvaLine data={lines} />
            <KonvaArrow data={arrows} />
            <KonvaRect data={rects} />
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default Home;
