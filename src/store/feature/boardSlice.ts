import { createSlice } from '@reduxjs/toolkit';

export enum TBoardPattern {
  line = 'line',
  arrow = 'arrow',
  rect = 'rect'
}

export enum LeftToolPattern {
  board = 'board',
  line = 'line',
  arrow = 'arrow',
  rect = 'rect'
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
  maxBoardSize: BoardSizeType | null;
  // 画画模式
  boardPattern: TBoardPattern;
  // 左边工具栏
  leftSideTool: LeftToolPattern;

  scale: number;
}

const initialState: IState = {
  boardBgColor: '#fff',
  boardPattern: TBoardPattern.line,
  leftSideTool: LeftToolPattern.board,
  boardSize: {
    width: 300,
    height: 150
  },
  maxBoardSize: null,
  scale: 1
};

const brushSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardPattern(state, action) {
      state.boardPattern = action.payload;
    },
    setBoardBgColor(state, action) {
      state.boardBgColor = action.payload;
    },
    setLeftSideTool(state, action) {
      state.leftSideTool = action.payload;
    },
    setBoardSize(state, action) {
      state.boardSize = action.payload;
      if (!state.maxBoardSize) {
        state.maxBoardSize = action.payload;
      }
    },
    setScale(state, action) {
      state.scale = action.payload;
    }
  }
});

export const {
  setBoardPattern,
  setBoardBgColor,
  setLeftSideTool,
  setBoardSize,
  setScale
} = brushSlice.actions;

export default brushSlice.reducer;

// 获取画板数据
export const getBoardSetting = (state: any): IState => state.board;
