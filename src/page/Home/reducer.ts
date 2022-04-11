import { calcPosition, containResize, setRatioCenter } from '@/utils';

export type Size = {
  width: number;
  height: number;
};

export const reducerInitialState = {
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

export type ACTIONTYPE =
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

export function reducer(state: typeof reducerInitialState, action: ACTIONTYPE) {
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

      // const res = calculateAspectRatioFit(
      //   boardWidth,
      //   boardHeight,
      //   stageWidth,
      //   stageHeight
      // );

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
