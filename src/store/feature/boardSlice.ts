import { createSlice } from '@reduxjs/toolkit';

export enum TBoardPattern {
  brush = 'brush',
  line = 'line'
}

export enum LeftToolPattern {
  brush = 'brush',
  board = 'board'
}

export type BoardSizeType = {
  width: number;
  height: number;
};

interface IState {
  // 画板背景
  boardBgColor: string;
  // 画板尺寸
  boardSize: BoardSizeType;
  // 画板尺寸最大值
  maxBoardSize: BoardSizeType;
  // 画画模式
  boardPattern: TBoardPattern;
  // 左边工具栏
  leftSideTool: LeftToolPattern;

  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
}

const initialState: IState = {
  boardBgColor: '#fff',
  boardPattern: TBoardPattern.brush,
  leftSideTool: LeftToolPattern.board,
  boardSize: {
    width: 300,
    height: 150
  },
  maxBoardSize: {
    width: 300,
    height: 150
  },
  canvas: null,
  ctx: null
};

const brushSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardPattern(state, action) {
      state.boardPattern = action.payload;
    },
    setBoardBgColor(state, action) {
      state.canvas!.style.backgroundColor = action.payload;
      state.boardBgColor = action.payload;
    },
    setLeftSideTool(state, action) {
      state.leftSideTool = action.payload;
    },
    setBoardSize(state, action) {
      state.boardSize = action.payload;
    },
    setMaxBoardSize(state, action) {
      state.maxBoardSize = action.payload;
    },
    setCanvas(state, action) {
      state.canvas = action.payload;
    },
    setCtx(state, action) {
      state.ctx = action.payload;
    }
  }
});

export const {
  setBoardPattern,
  setBoardBgColor,
  setLeftSideTool,
  setBoardSize,
  setMaxBoardSize,
  setCtx,
  setCanvas
} = brushSlice.actions;

export default brushSlice.reducer;

// 获取画板数据
export const getBoardSetting = (state: any): IState => state.board;
