import { ScaleTool } from '@/components/ScaleTool';
import { getBoardSetting } from '@/store/feature/boardSlice';
import {
  calcPosition,
  calcStageSize,
  containResize,
  heightMargin,
  setRatioCenter,
  widthMargin
} from '@/utils';
import Konva from 'konva';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { StageConfig } from 'konva/lib/Stage';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Arrow, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';

import './index.css';

const reducerInitialState = {
  boardSize: { width: 0, height: 0 },
  boardPostion: {
    x: 0,
    y: 0
  },
  scale: {
    x: 1,
    y: 1
  },
  defaultScale: 1
};

type Size = {
  width: number;
  height: number;
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
      type: 'resizeScale';
      payload: {
        stageWidth: number;
        stageHeight: number;
      };
    }
  | {
      type: 'scaleChange';
      payload: {
        scale: number;
        stageWidth: number;
        stageHeight: number;
      };
    };

function reducer(state: typeof reducerInitialState, action: ACTIONTYPE) {
  const { width: boardWidth, height: boardHeight } = state.boardSize;
  switch (action.type) {
    case 'boardSize':
      return { ...state, boardSize: action.payload };
    case 'resizeScale':
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
        defaultScale: ratio,
        boardPostion: {
          x: x,
          y: y
        }
      };
    case 'scaleChange':
      const {
        scale,
        stageWidth: sWidth,
        stageHeight: sHeight
      } = action.payload;

      const { x: px, y: py } = calcPosition(
        sWidth,
        sHeight,
        boardWidth * scale,
        boardHeight * scale
      );

      return {
        ...state,
        scale: {
          x: scale,
          y: scale
        },
        boardPostion: {
          x: px,
          y: py
        }
      };
    default:
      throw new Error('无对应的action.type');
  }
}

export default function Home() {
  // const dispatch = useDispatch();
  const { boardSize } = useSelector(getBoardSetting);

  const StageWrapRef = useRef<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage | null>();
  const boardRef = useRef<Konva.Rect | null>();
  const defaultStageSize = useRef<Size | null>();

  const [photos, setPhotos] = useState<ImageConfig[]>([]);
  const [texts, setTests] = useState<TextConfig[]>([]);
  const [arrows, setArrows] = useState<ArrowConfig[]>([]);
  const [rects, setRects] = useState<RectConfig[]>([]);

  const handleMouseDown = useCallback(() => {}, []);
  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUp = useCallback(() => {}, []);

  const [board, dispatch] = useReducer(reducer, reducerInitialState);

  const resizeHandle = useCallback(() => {
    const dom = StageWrapRef.current as HTMLElement;

    const { stageWidth, stageHeight } = calcStageSize(
      dom.offsetWidth,
      dom.offsetHeight - 1
    );
    dispatch({
      type: 'boardSize',
      payload: { ...boardSize }
    });
    dispatch({
      type: 'resizeScale',
      payload: {
        stageWidth: stageWidth,
        stageHeight: stageHeight
      }
    });

    console.log(stageWidth);
    stageRef.current?.width(stageWidth);
    stageRef.current?.height(stageHeight);

    setTimeout(() => {
      defaultStageSize.current = {
        width: stageRef.current?.width(),
        height: stageRef.current?.height()
      } as Size;
    });
  }, [boardSize]);

  useEffect(() => {
    window.addEventListener('resize', resizeHandle);
    resizeHandle();
    return () => {
      window.removeEventListener('resize', resizeHandle);
    };
  }, [resizeHandle]);

  useEffect(() => {
    // console.log((StageWrapRef.current?.scrollLeft = 20));
    // console.log(StageWrapRef.current?.scrollTop);
  }, [board.scale]);

  useEffect(() => {
    const observerSideDom = () => {
      const config = { attributes: true };
      const callback = function () {
        setTimeout(() => {
          resizeHandle();
        });
      };
      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback);
      // 以上述配置开始观察目标节点
      observer.observe(document.getElementById('side') as HTMLElement, config);
      return observer;
    };
    const observer = observerSideDom();

    return () => observer?.disconnect();
  }, [resizeHandle]);

  const onScaleChange = (scale: number, resize = false) => {
    const { boardSize } = board;

    let result = defaultStageSize.current as Size;

    // 舞台根据背景版比例响应增加margin
    if (scale === board.defaultScale || resize) {
      resizeHandle();
      (StageWrapRef.current as HTMLElement).classList.remove('overflow-x-auto');
      (StageWrapRef.current as HTMLElement).classList.add('overflow-x-hidden');
    } else if (scale < (board.defaultScale as number)) {
      dispatch({
        type: 'scaleChange',
        payload: {
          stageHeight: result.height,
          stageWidth: result.width,
          scale
        }
      });
      stageRef.current?.width(result.width);
      stageRef.current?.height(result.height);
      (StageWrapRef.current as HTMLElement).classList.remove('overflow-x-auto');
      (StageWrapRef.current as HTMLElement).classList.add('overflow-x-hidden');
    } else {
      const scaleHeight = (boardSize.height * scale + heightMargin) as number;
      const sacleWidth = (boardSize.width * scale + widthMargin) as number;
      const lastHeight = stageRef.current?.height() as number;
      const lastWidth = stageRef.current?.width() as number;
      (StageWrapRef.current as HTMLElement).classList.remove(
        'overflow-x-hidden'
      );
      (StageWrapRef.current as HTMLElement).classList.add('overflow-x-auto');

      if (scaleHeight > lastHeight && sacleWidth > lastWidth) {
        result = {
          width: sacleWidth,
          height: scaleHeight
        };
      } else if (scaleHeight > lastHeight) {
        result = {
          width: lastWidth,
          height: scaleHeight
        };
      } else if (sacleWidth > lastWidth) {
        result = {
          width: sacleWidth,
          height: lastHeight
        };
      } else if (scaleHeight < lastHeight && sacleWidth < lastWidth) {
        result = {
          width: Math.max(sacleWidth, result.width),
          height: Math.max(scaleHeight, result.height)
        };
      } else {
        throw new Error('无法判断出当前缩放模式');
      }

      dispatch({
        type: 'scaleChange',
        payload: {
          stageHeight: result.height,
          stageWidth: result.width,
          scale
        }
      });
      stageRef.current?.width(result.width);
      stageRef.current?.height(result.height);
    }
  };

  return (
    <div
      style={{ flex: '1' }}
      className=' flex flex-col w-full h-full  relative'
    >
      <div className='bg-secondary relative  w-full h-full flex-1'>
        <div
          className='absolute  top-0  left-0  w-full h-full overflow-x-hidden overflow-y-auto'
          ref={StageWrapRef as React.LegacyRef<HTMLDivElement>}
        >
          {/* <div className='bg-primary'>tool</div> */}
          <div className='relative' id='test'>
            {/* {stageSize && ( */}
            <Stage
              ref={stageRef as React.LegacyRef<Konva.Stage>}
              // width={stageSize.width}
              // height={stageSize.height}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              className='stageClass'
            >
              <Layer>
                <Rect
                  ref={boardRef as React.LegacyRef<Konva.Rect>}
                  x={board.boardPostion.x}
                  y={board.boardPostion.y}
                  width={board.boardSize.width}
                  height={board.boardSize.height}
                  fill={'white'}
                  strokeWidth={4 / board.scale.x} // border width: ;
                  stroke='#E0E2E6' // border color
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
            {/* )} */}
          </div>
        </div>
      </div>
      <ScaleTool value={board.scale.x} onChange={onScaleChange} />
    </div>
  );
}
