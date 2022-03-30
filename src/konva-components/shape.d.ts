import { TBoardPattern } from '@/store/feature/boardSlice';
import Konva from 'konva';

export type baseProps = {
  draggable: boolean;
  // onChange?: Function;
  boardPattern?: TBoardPattern;
  stage?: Konva.Stage;
  paintLayertRef?: Konva.Layer;
};

export type KonvaLineProps = {
  data: LineConfig[];
} & baseProps;
export type KonvaArrowProps = {
  data: ArrowConfig[];
} & baseProps;
export type KonvaRectProps = {
  // data: RectConfig[];
} & baseProps;
export type KonvaTextProps = {
  // data: RectConfig[];
} & baseProps;
