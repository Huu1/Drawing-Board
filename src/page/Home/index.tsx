import { DataContext, DataProp } from '@/App';
import URLImage, {
  ImageElement,
  loadingSufix,
  URLImageProps
} from '@/components/Image';
import { ScaleTool } from '@/components/ScaleTool';
import TextElement, { TextElementProps } from '@/components/Text';
import { useMutationObserver, useWindowResize } from '@/Hooks/home';
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
import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
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
import { reducer, reducerInitialState, Size } from './reducer';

export enum ShpaeType {
  image = 'image',
  text = 'text'
}

export default function Home() {
  // const dispatch = useDispatch();
  const { boardSize } = useSelector(getBoardSetting);

  const StageWrapRef = useRef<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage | null>();
  const boardRef = useRef<Konva.Rect | null>();
  const maskRef = useRef<Konva.Layer | null>();
  const layerRef = useRef<Konva.Layer | null>();
  const defaultStageSize = useRef<Size | null>();

  const ref = useRef(false);

  const trRef = useRef<Konva.Transformer>();
  const trBoarderRef = useRef<Konva.Transformer>();

  const handleClick = useCallback((e) => {}, []);
  const handleMouseDown = useCallback((e) => {
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target === boardRef.current;
    trBoarderRef.current?.nodes([]);
    if (clickedOnEmpty) {
      selectShape(null);
    }
  }, []);
  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUp = useCallback(() => {}, []);

  const [board, dispatch] = useReducer(reducer, reducerInitialState);

  const { elements, setElements, selectedId, selectShape }: DataProp =
    useContext(DataContext);

  // const [elements, setElements] = useState<
  //   Array<ImageElement | TextElementProps>
  // >([]);

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

  useWindowResize(resizeHandle);

  useMutationObserver(resizeHandle);

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
      e.preventDefault();
      stage.setPointersPositions(e);
      const { x: cx, y: cy } = stage.getPointerPosition() as {
        x: number;
        y: number;
      };
      const id = Date.now();

      let TransData = e.dataTransfer?.getData('text/plain') as string;

      const getRatio = () => {
        return innerWtihOuterBoxRatio(
          cx,
          cy,
          board.boardPostion.x,
          board.boardPostion.y,
          board.boardSize.width * board.scale.x,
          board.boardSize.height * board.scale.y
        );
      };

      if (TransData && TransData.includes(splitCode)) {
        const [height, src] = TransData.split(splitCode);
        setElements((elements: Array<ImageElement | TextElementProps>) => [
          ...elements,
          {
            ratio: getRatio(),
            shapeProps: {
              x: cx,
              y: cy,
              src
            },
            id: `image${id}`,
            height,
            shapeType: ShpaeType.image
          } as unknown as ImageElement
        ]);
      } else if (TransData) {
        setElements((elements: Array<ImageElement | TextElementProps>) => [
          ...elements,
          {
            ratio: getRatio(),
            shapeProps: {
              x: cx,
              y: cy,
              text: TransData,
              fontSize: 22,
              width: 400,
              padding: 5,
              align: 'center',
              visible: true,
              fontFamily: 'Roboto'
            },
            id: `text${id}`,
            shapeType: ShpaeType.text
          } as unknown as TextElementProps
        ]);
      }
    }

    con.addEventListener('dragover', dragover);
    con.addEventListener('drop', drop);
    return () => {
      con.removeEventListener('dragover', dragover);
      con.removeEventListener('drop', drop);
    };
  }, [board, setElements]);

  useEffect(() => {
    if (ref.current) {
      setElements((p: Array<ImageElement | TextElementProps>) => {
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
  }, [board, setElements]);

  const shapeChange = useCallback(
    (newAttrs: Konva.ImageConfig, index: number) => {
      const { boardPostion, boardSize } = board;

      setElements((elements: Array<ImageElement | TextElementProps>) => {
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
    [board, setElements]
  );

  const renderElements = useCallback(() => {
    return elements?.map((item, index) => {
      switch (item.shapeType) {
        case ShpaeType.image:
          return (
            <URLImage
              key={item.id}
              {...(item as ImageElement)}
              scale={{
                x: board.scale.x,
                y: board.scale.y
              }}
              onChange={(newAttrs: Konva.ImageConfig) =>
                shapeChange(newAttrs, index)
              }
              onSelect={(id?: number) => {
                selectShape(
                  id && id.toString().includes(loadingSufix) ? id : item.id
                );
              }}
            />
          );
        case ShpaeType.text:
          return (
            <TextElement
              key={item.id}
              {...(item as TextElementProps)}
              scale={{
                x: board.scale.x,
                y: board.scale.y
              }}
              onChange={(newAttrs: Konva.ImageConfig) =>
                shapeChange(newAttrs, index)
              }
              onSelect={(data: any) => {
                selectShape(data === null ? data : item.id);
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
      const shape = stageRef.current?.find(`#${selectedId}`);
      if (shape) {
        trRef.current?.nodes(shape);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [selectedId]);

  const handleMouseOver = (e: any) => {
    if (e.target === e.target.getStage() || e.target === boardRef.current) {
      return;
    }
    if (e.target.attrs.id === selectedId) {
      return;
    }
    trBoarderRef.current?.nodes([e.target]);
  };

  const handleMouseOut = (e: any) => {
    if (e.target === e.target.getStage() || e.target === boardRef.current) {
      return;
    }
    trBoarderRef.current?.nodes([]);
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
          <div className='relative'>
            <Stage
              ref={stageRef as React.LegacyRef<Konva.Stage>}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
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

                <Transformer
                  ref={trBoarderRef as React.LegacyRef<Konva.Transformer>}
                  enabledAnchors={[]}
                  rotateEnabled={false}
                  borderStrokeWidth={2}
                />
              </Layer>
              <Layer ref={maskRef as React.LegacyRef<Konva.Layer>}>
                {selectedId && (
                  <Transformer
                    ref={trRef as React.LegacyRef<Konva.Transformer>}
                    id='maskLayerTransform'
                    keepRatio={true}
                    borderStrokeWidth={2}
                    enabledAnchors={
                      selectedId && selectedId.toString().includes('text')
                        ? [
                            // 'top-left',
                            // 'top-right',
                            'middle-right',
                            'middle-left'
                            // 'bottom-left',
                            // 'bottom-right'
                          ]
                        : [
                            'top-left',
                            'top-center',
                            'top-right',
                            'middle-right',
                            'middle-left',
                            'bottom-left',
                            'bottom-center',
                            'bottom-right'
                          ]
                    }
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
