import URLImage, { ImageElement, URLImageProps } from '@/components/Image';
import { ScaleTool } from '@/components/ScaleTool';
import { splitCode } from '@/layout/LeftSider/Photos';
import { getBoardSetting } from '@/store/feature/boardSlice';
import {
  calcPosition,
  calcStageSize,
  calculateAspectRatioFit,
  containResize,
  heightMargin,
  innerWtihOuterBoxRatio,
  setRatioCenter,
  widthMargin
} from '@/utils';
import Konva from 'konva';
import { NodeConfig } from 'konva/lib/Node';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  Arrow,
  Group,
  Image,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer
} from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import useImage from 'use-image';

import './index.css';

export enum ShpaeType {
  image = 'image'
}

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

      const res = calculateAspectRatioFit(
        boardWidth,
        boardHeight,
        stageWidth,
        stageHeight
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
  const maskRef = useRef<Konva.Layer | null>();
  const GROUPRef = useRef<Konva.Group | null>();
  const layerRef = useRef<Konva.Layer | null>();
  const defaultStageSize = useRef<Size | null>();

  const ref = useRef(false);

  const trRef = useRef<Konva.Transformer>();

  const [selectedId, selectShape] = useState<number | null>(null);

  const handleClick = useCallback((e) => {}, []);
  const handleMouseDown = useCallback((e) => {
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target === boardRef.current;
    if (clickedOnEmpty) {
      selectShape(null);
    }
  }, []);
  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUp = useCallback(() => {}, []);

  const [board, dispatch] = useReducer(reducer, reducerInitialState);

  const [elements, setElements] = useState<Array<ImageElement>>([]);

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

  useEffect(() => {
    // const mask = maskRef.current as Konva.Layer;
    // let tr = new Konva.Transformer();
    // mask.add(tr);
    // trRef.current = tr;
  }, []);

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

  const dragImg = (e: any) => {};

  useEffect(() => {
    const stage = stageRef.current as Konva.Stage;
    let con = stage.container();

    function dragover(e: { preventDefault: () => void }) {
      e.preventDefault(); // !important
    }

    function drop(e: any) {
      const stage = stageRef.current as Konva.Stage;

      let itemURL = e.dataTransfer?.getData('text/plain') as string;

      const [height, src] = itemURL.split(splitCode);

      e.preventDefault();
      stage.setPointersPositions(e);

      const { x: cx, y: cy } = stage.getPointerPosition() as {
        x: number;
        y: number;
      };

      const id = Date.now();
      setElements((elements) => [
        ...elements,
        {
          ratio: innerWtihOuterBoxRatio(
            cx,
            cy,
            board.boardPostion.x,
            board.boardPostion.y,
            board.boardSize.width * board.scale.x,
            board.boardSize.height * board.scale.y
          ),
          shapeProps: {
            x: cx,
            y: cy,
            src
          },
          id,
          height,
          shapeType: ShpaeType.image
        } as unknown as ImageElement
      ]);
    }

    con.addEventListener('dragover', dragover);
    con.addEventListener('drop', drop);
    return () => {
      con.removeEventListener('dragover', dragover);
      con.removeEventListener('drop', drop);
    };
  }, [board]);

  useEffect(() => {
    if (ref.current) {
      setElements((p) => {
        let result = p.map((item) => {
          return {
            ...item,
            shapeProps: {
              ...item.shapeProps,
              x:
                board.boardPostion.x +
                board.boardSize.width * board.scale.x * item.ratio.x,
              y:
                board.boardPostion.y +
                board.boardSize.height * board.scale.y * item.ratio.y
            }
          };
        });
        return result;
      });
    } else {
      ref.current = true;
    }
  }, [board]);

  const shapeChange = useCallback(
    (newAttrs: Konva.ImageConfig, index: number) => {
      const { boardPostion, boardSize } = board;

      setElements((elements) => {
        const all = elements.slice();
        const target = all[index];
        target.shapeProps = newAttrs;
        target.ratio = innerWtihOuterBoxRatio(
          newAttrs.x as number,
          newAttrs.y as number,
          boardPostion.x,
          boardPostion.y,
          boardSize.width * board.scale.x,
          boardSize.height * board.scale.y
        );
        return all;
      });
    },
    [board]
  );

  const renderElements = useCallback(() => {
    return elements?.map((item, index) => {
      switch (item.shapeType) {
        case ShpaeType.image:
          return (
            <URLImage
              key={index}
              {...item}
              scale={{
                x: board.scale.x,
                y: board.scale.y
              }}
              onChange={(newAttrs: Konva.ImageConfig) =>
                shapeChange(newAttrs, index)
              }
              onSelect={(id?: number) => {
                selectShape(id && typeof id === 'number' ? id : item.id);
              }}
            />
          );
        default:
          break;
      }
    });
  }, [board.scale.x, board.scale.y, elements, shapeChange]);

  useEffect(() => {
    if (selectedId) {
      setTimeout(() => {
        const shape = stageRef.current?.find(`#${selectedId}`);
        if (shape) {
          trRef.current?.nodes(shape);
          trRef.current?.getLayer()?.batchDraw();
        }
      });
    }
  }, [selectedId]);

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
          <div className='relative'>
            <Stage
              ref={stageRef as React.LegacyRef<Konva.Stage>}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              // onClick={handleClick}
              className='stageClass'
              onDragEnd={dragImg}
            >
              <Layer
                ref={layerRef as React.LegacyRef<Konva.Layer>}
                clipHeight={board.boardSize.height * board.scale.y}
                clipWidth={board.boardSize.width * board.scale.x}
                clipY={board.boardPostion.y}
                clipX={board.boardPostion.x}
              >
                <Rect
                  ref={boardRef as React.LegacyRef<Konva.Rect>}
                  x={board.boardPostion.x}
                  y={board.boardPostion.y}
                  width={board.boardSize.width}
                  height={board.boardSize.height}
                  fill={'white'}
                  // strokeWidth={4 / board.scale.x} // border width: ;
                  stroke='#E0E2E6' // border color
                  name='background'
                  scale={{
                    x: board.scale.x,
                    y: board.scale.y
                  }}
                />
                {renderElements()}
              </Layer>
              <Layer ref={maskRef as React.LegacyRef<Konva.Layer>}>
                {selectedId && (
                  <Transformer
                    ref={trRef as React.LegacyRef<Konva.Transformer>}
                    keepRatio={false}
                    boundBoxFunc={(oldBox, newBox) => {
                      // limit resize
                      if (newBox.width < 10 || newBox.height < 10) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
      <ScaleTool value={board.scale.x} onChange={onScaleChange} />
    </div>
  );
}
