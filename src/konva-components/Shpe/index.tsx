import Konva from 'konva';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import { LineConfig } from 'konva/lib/shapes/Line';
import { RectConfig } from 'konva/lib/shapes/Rect';
import * as React from 'react';
import { Arrow, Line, Rect } from 'react-konva';

type KonvaLineProps = {
  data: LineConfig[];
};
type KonvaArrowProps = {
  data: ArrowConfig[];
};
type KonvaRectProps = {
  data: RectConfig[];
};

export const KonvaLine = React.memo((props: KonvaLineProps) => {
  return (
    <>
      {props.data.map((line: LineConfig, i: number) => (
        <Line
          key={i}
          points={line.points}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          tension={0.5}
          dash={line.dash}
          lineCap={line.lineCap}
          lineJoin={line.lineJoin}
        />
      ))}
    </>
  );
});

export const KonvaArrow = React.memo((props: KonvaArrowProps) => {
  return (
    <>
      {props.data.map((arrow: ArrowConfig, i: number) => (
        <Arrow
          key={i}
          points={arrow.points}
          fill={arrow.fill}
          stroke={arrow.stroke}
          strokeWidth={arrow.strokeWidth}
          pointerLength={arrow.pointerLength}
          pointerWidth={arrow.pointerWidth}
        />
      ))}
    </>
  );
});

export const KonvaRect = React.memo((props: KonvaRectProps) => {
  return (
    <>
      {props.data.map((rect: RectConfig, i: number) => (
        <Rect
          key={i}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill={rect.fill}
          shadowBlur={rect.shadowBlur}
          cornerRadius={rect.cornerRadius}
        />
      ))}
    </>
  );
});
