import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Arrow, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
export default function Home() {
  // const dispatch = useDispatch();
  // const { boardPattern, boardBgColor, boardSize, canvas, ctx } =
  //   useSelector(getBoardSetting);

  const StageRef = useRef<HTMLDivElement>();
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  const [photos, setPhotos] = useState<ImageConfig[]>([]);
  const [texts, setTests] = useState<TextConfig[]>([]);
  const [arrows, setArrows] = useState<ArrowConfig[]>([]);
  const [rects, setRects] = useState<RectConfig[]>([]);

  const handleMouseDown = useCallback(() => {}, []);
  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUp = useCallback(() => {}, []);

  useEffect(() => {
    const dom = StageRef.current as HTMLElement;
    setSize({
      width: dom.clientWidth,
      height: dom.clientHeight
    });
    const config = { attributes: true };
    const callback = function (mutationsList: any, observer: any) {
      console.log(mutationsList);
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(document, config);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className='h-full' ref={StageRef as React.LegacyRef<HTMLDivElement>}>
      {size && (
        <Stage
          width={size.width}
          height={size.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              // width={boardSize.width}
              // height={boardSize.height}
              // fill={boardBgColor}
              shadowBlur={10}
              name='background'
            />
          </Layer>
          <Layer>
            {arrows.map((arrow: ArrowConfig, i: number) => (
              <Arrow
                key={i}
                points={arrow.points}
                fill={arrow.fill}
                stroke={arrow.stroke}
                strokeWidth={arrow.strokeWidth}
                pointerLength={arrow.pointerLength}
                pointerWidth={arrow.pointerWidth}
                name='arrow'
              />
            ))}
            {texts.map((text: TextConfig, i: number) => (
              <Text
                key={i}
                x={text.x}
                y={text.y}
                text={text.text}
                fontSize={text.fontSize}
                fill={text.fill}
                shadowBlur={text.shadowBlur}
                cornerRadius={text.cornerRadius}
                name='text'
              />
            ))}
            {rects.map((rect: RectConfig, i: number) => (
              <Rect
                key={i}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={rect.fill}
                shadowBlur={rect.shadowBlur}
                cornerRadius={rect.cornerRadius}
                name='rect'
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
