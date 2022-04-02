import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
import { containResize, setRatioCenter } from '@/utils';
import Konva from 'konva';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { StageConfig } from 'konva/lib/Stage';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Arrow, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';

const initialState = {
  boardSize: { width: 0, height: 0 },
  boardPostion: {
    x: 0,
    y: 0
  },
  scale: {
    x: 1,
    y: 1
  }
};

type ACTIONTYPE =
  | {
      type: 'boardSize';
      payload: {
        width: number;
        height: number;
      };
    }
  | {
      type: 'scale';
      payload: {
        stageWidth: number;
        stageHeight: number;
      };
    };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  const { width: boardWidth, height: boardHeight } = state.boardSize;
  switch (action.type) {
    case 'boardSize':
      return { ...state, boardSize: action.payload };
    case 'scale':
      const { stageWidth, stageHeight } = action.payload;
      const { width: ScaleWwidth, height: ScaleHeight } = containResize(
        stageWidth,
        stageHeight,
        boardWidth,
        boardHeight
      );
      const { ratio, x, y } = setRatioCenter(
        ScaleWwidth,
        ScaleHeight,
        stageWidth,
        stageHeight,
        boardWidth,
        boardHeight
      );

      return {
        ...state,
        scale: {
          x: ratio,
          y: ratio
        },
        boardPostion: {
          x: x,
          y: y
        }
      };
    default:
      throw new Error('无对应的action.type');
  }
}

export default function Home() {
  // const dispatch = useDispatch();
  // const { boardPattern, boardBgColor, boardSize, canvas, ctx } =
  //   useSelector(getBoardSetting);

  const StageWrapRef = useRef<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage | null>();
  const boardRef = useRef<Konva.Rect | null>();

  const [stageSize, setStageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [photos, setPhotos] = useState<ImageConfig[]>([]);
  const [texts, setTests] = useState<TextConfig[]>([]);
  const [arrows, setArrows] = useState<ArrowConfig[]>([]);
  const [rects, setRects] = useState<RectConfig[]>([]);

  const handleMouseDown = useCallback(() => {}, []);
  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUp = useCallback(() => {}, []);

  const [board, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const dom = StageWrapRef.current as HTMLElement;
    const config = { attributes: true };

    const callback = function () {
      resizeHandle();
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(document.getElementById('side') as HTMLElement, config);

    const resizeHandle = () => {
      setStageSize({
        width: dom.offsetWidth,
        height: dom.offsetHeight
      });
      dispatch({
        type: 'boardSize',
        payload: {
          height: 1200,
          width: 400
        }
      });
      dispatch({
        type: 'scale',
        payload: {
          stageWidth: dom.offsetWidth,
          stageHeight: dom.offsetHeight
        }
      });
    };
    resizeHandle();
    window.addEventListener('resize', resizeHandle);
    return () => {
      window.removeEventListener('resize', resizeHandle);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className='h-full overflow-auto relative'
      ref={StageWrapRef as React.LegacyRef<HTMLDivElement>}
    >
      {stageSize && (
        <Stage
          ref={stageRef as React.LegacyRef<Konva.Stage>}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Rect
              ref={boardRef as React.LegacyRef<Konva.Rect>}
              x={board.boardPostion.x}
              y={board.boardPostion.y}
              width={board.boardSize.width}
              height={board.boardSize.height}
              fill={'white'}
              shadowBlur={1}
              name='background'
              scale={{
                x: board.scale.x,
                y: board.scale.y
              }}
            />
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
