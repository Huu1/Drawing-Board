import useDom from '@/Hooks/useDom';
import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { getBrushSetting } from '@/store/feature/brushSlice';
import * as React from 'react';
import { Stage, Layer, Text, Line } from 'react-konva';
import { useSelector } from 'react-redux';

let timer;

const Demo = () => {
  const [tool, setTool] = React.useState('pen');
  const [lines, setLines] = React.useState<any>([]);
  const isDrawing = React.useRef(false);
  const [isMounted, Mounted] = React.useState(false);
  const [canvasWrapDOM, canvasWrapDOMRef] = useDom<HTMLDivElement>();

  const { brushWidth, brushColor } = useSelector(getBrushSetting);
  const { boardPattern } = useSelector(getBoardSetting);

  React.useEffect(() => {
    if (canvasWrapDOM) {
      Mounted(true);
    }
  }, [canvasWrapDOM]);

  const handleMouseDown = React.useCallback(
    (e: any) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines((lines: any[]) => [
        ...lines,
        { tool, points: [pos.x, pos.y], stroke: brushColor }
      ]);
    },
    [brushColor, tool]
  );

  const handleMouseMove = React.useCallback(
    (e: any) => {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setLines((lines: any[]) => {
        let lastLine = lines[lines.length - 1];
        lastLine.stroke = brushColor;
        lastLine.strokeWidth = brushWidth;
        lastLine.dash = [];

        // add point
        switch (boardPattern) {
          case TBoardPattern.brush:
            lastLine.points = lastLine.points.concat([point.x, point.y]);
            break;
          case TBoardPattern.line:
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
    [boardPattern, brushColor, brushWidth]
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
            {lines.map((line: any, i: any) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                dash={line.dash}
                lineCap='round'
                lineJoin='round'
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      )}

      <select
        value={tool}
        className='absolute'
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value='pen'>Pen</option>
        <option value='eraser'>Eraser</option>
      </select>
    </div>
  );
};

export default Demo;
