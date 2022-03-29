import { TBoardPattern } from '@/store/feature/boardSlice';
import Konva from 'konva';
import { RectConfig } from 'konva/lib/shapes/Rect';
import React, { useCallback, useEffect } from 'react';
import { Rect } from 'react-konva';
import { KonvaRectProps } from './shape';
let tr: Konva.Transformer | null;

export const KonvaRect = React.memo((props: KonvaRectProps) => {
  const { stage, boardPattern, paintLayertRef } = props;
  const isDrawing = React.useRef(false);
  const [rects, setRect] = React.useState<RectConfig[]>([]);
  const handleMouseDown = useCallback((e) => {
    const stage = e.target.getStage() as Konva.Stage;
    if (e.target === stage || e.target === stage.find('.background')[0]) {
      // 点击背景或舞台
      tr?.nodes([]);
      isDrawing.current = true;
      const point = stage.getPointerPosition();
      setRect((data: RectConfig[]) => [...data, { x: point?.x, y: point?.y }]);
    } else {
      if (tr?.isTransforming()) return;
      // 点击元素
      // tr?.nodes([]);
      tr?.nodes([e.target]);
      // console.log(e.target, tr?.nodes());
    }
  }, []);
  const handleMouseMove = useCallback((e) => {
    if (!isDrawing.current) {
      return;
    }
    const point = e.target.getStage().getPointerPosition();
    // console.log(data);

    setRect((data: any[]) => {
      if (data.length === 0) return [];
      let last = data[data.length - 1];
      last.fill = 'black';
      last.strokeWidth = 5;
      last.width = point.x - last.x;
      last.height = point.y - last.y;
      // replace last
      data.splice(data.length - 1, 1, last);
      return data.concat();
    });
  }, []);
  const handleMouseUp = useCallback((e) => {
    if (isDrawing.current && tr?.nodes().length === 0) {
      const stage = e.target.getStage() as Konva.Stage;
      let shapes = stage.find('.rect');
      let selected = shapes[shapes.length - 1];

      if (selected.height() !== 0 && selected.width() !== 0) {
        tr?.nodes([selected]);
      }
      // setRect((data: RectConfig[]) => {
      //   return data.filter((i: RectConfig) => i.width && i.height);
      // });
    }
    isDrawing.current = false;
  }, []);
  useEffect(() => {
    if (boardPattern === TBoardPattern.rect) {
      tr = new Konva.Transformer();
      paintLayertRef?.add(tr);
      stage?.on('mousedown', handleMouseDown);
      stage?.on('mousemove', handleMouseMove);
      stage?.on('mouseup', handleMouseUp);
      // stage?.on('click', handleClick);
    }
    return () => {
      tr?.destroy();
      tr = null;
      stage?.off('mousedown', handleMouseDown);
      stage?.off('mousemove', handleMouseMove);
      stage?.off('mouseup', handleMouseUp);
      // stage?.off('click', handleClick);
    };
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    boardPattern,
    stage,
    paintLayertRef
  ]);
  return (
    <>
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
          draggable={props.draggable}
          name='rect'
        />
      ))}
    </>
  );
});
