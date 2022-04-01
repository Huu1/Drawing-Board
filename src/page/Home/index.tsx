import { getBoardSetting, TBoardPattern } from '@/store/feature/boardSlice';
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
      type: 'boardPostion';
      payload: {
        stageWidth: number;
        stageHeight: number;
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
    case 'boardPostion':
      const { stageWidth, stageHeight } = action.payload;
      let x: number, y: number;
      x = (stageWidth - boardWidth * state.scale.x) / 2;
      y = (stageHeight - boardHeight * state.scale.y) / 2;
      return {
        ...state
        // boardPostion: {
        //   x,
        //   y
        // }
      };
    case 'scale':
      /**
       * @param {Number} sx 固定盒子的x坐标,sy 固定盒子的y左标
       * @param {Number} box_w 固定盒子的宽, box_h 固定盒子的高
       * @param {Number} source_w 原图片的宽, source_h 原图片的高
       * @return {Object} {drawImage的参数，缩放后图片的x坐标，y坐标，宽和高},对应drawImage(imageResource, dx, dy, dWidth, dHeight)
       */
      const containImg = (
        sx: number,
        sy: number,
        box_w: number,
        box_h: number,
        source_w: number,
        source_h: number
      ) => {
        let dx = sx,
          dy = sy,
          dWidth = box_w,
          dHeight = box_h;
        if (source_w > source_h || (source_w === source_h && box_w < box_h)) {
          dHeight = (source_h * dWidth) / source_w;
          dy = sy + (box_h - dHeight) / 2;
        } else if (
          source_w < source_h ||
          (source_w === source_h && box_w > box_h)
        ) {
          dWidth = (source_w * dHeight) / source_h;
          dx = sx + (box_w - dWidth) / 2;
        }
        return {
          dx,
          dy,
          dWidth,
          dHeight
        };
      };

      const obj = containImg(
        0,
        0,
        action.payload.stageWidth,
        action.payload.stageHeight,
        boardWidth,
        boardHeight
      );

      const { dHeight, dWidth } = obj;

      console.log(dHeight, dWidth);

      let ratio = 1;
      if (dWidth === dHeight) {
      } else if (dWidth === action.payload.stageWidth) {
        ratio = (dWidth - 20) / boardWidth;
      } else if (dHeight === action.payload.stageHeight) {
        ratio = (dHeight - 50) / boardHeight;
      }
      console.log(ratio);

      // const { stageWidth, stageHeight } = action.payload;
      // const { boardWidth, boardHeight } = state.boardSize;
      // let ratio;
      // if (boardHeight < boardWidth) {
      //   let idealHeight = action.payload.stageHeight - 40;
      //   ratio = idealHeight / boardHeight;
      // } else {
      //   let idealWidth = action.payload.stageWidth - 40;
      //   ratio = idealWidth / boardWidth;
      // }

      let px: number, py: number;
      px = (action.payload.stageWidth - boardWidth * ratio) / 2;
      py = (action.payload.stageHeight - boardHeight * ratio) / 2;

      // // console.log();

      // console.log({
      //   scale: {
      //     x: ratio,
      //     y: ratio
      //   },
      //   boardPostion: {
      //     x: px,
      //     y: py
      //   }
      // });

      return {
        ...state,
        scale: {
          x: ratio,
          y: ratio
        },
        boardPostion: {
          x: px,
          y: py
        }
      };
    default:
      throw new Error();
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
        width: dom.clientWidth,
        height: dom.clientHeight
      });

      dispatch({
        type: 'boardSize',
        payload: {
          height: 300,
          width: 1280
        }
      });
      // dispatch({
      //   type: 'boardPostion',
      //   payload: {
      //     stageWidth: dom.clientWidth,
      //     stageHeight: dom.clientHeight
      //   }
      // });

      dispatch({
        type: 'scale',
        payload: {
          stageWidth: dom.clientWidth,
          stageHeight: dom.clientHeight
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
