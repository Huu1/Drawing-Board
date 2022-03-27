import useDom from '@/Hooks/useDom';
import { KonvaArrow, KonvaLine, KonvaRect } from '@/konva-components/Shpe';
import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { getLineStyle, LinePattern } from '@/store/feature/lineSlice';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { LineConfig } from 'konva/lib/shapes/Line';
import { RectConfig } from 'konva/lib/shapes/Rect';
import * as React from 'react';
import { Stage, Layer, Text } from 'react-konva';
import { useSelector } from 'react-redux';

const Home = () => {
  const isDrawing = React.useRef(false);
  const [tool, setTool] = React.useState('pen');
  const [lines, setLines] = React.useState<LineConfig[]>([]);
  const [arrows, setArrows] = React.useState<ArrowConfig[]>([]);
  const [rects, setRect] = React.useState<RectConfig[]>([]);
  const [isMounted, Mounted] = React.useState(false);
  const [canvasWrapDOM, canvasWrapDOMRef] = useDom<HTMLDivElement>();

  const { strokeWidth, stroke, dash, linePattrn } = useSelector(getLineStyle);
  const { boardPattern } = useSelector(getBoardSetting);

  React.useEffect(() => {
    if (canvasWrapDOM) {
      Mounted(true);
    }
  }, [canvasWrapDOM]);

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

  return (
    <div
      ref={canvasWrapDOMRef as React.LegacyRef<HTMLDivElement>}
      style={{ height: '100%', background: 'white' }}
      className='relative rounded-sm overflow-hidden'
    >
      {isMounted && (
        <Stage
          width={canvasWrapDOM.clientWidth}
          height={canvasWrapDOM.clientHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
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
