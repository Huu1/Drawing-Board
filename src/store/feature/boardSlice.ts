import { createSlice } from '@reduxjs/toolkit';

export enum LeftToolPattern {
  board = 'board',
  line = 'line',
  arrow = 'arrow',
  rect = 'rect',
  slect = 'select',
  text = 'text'
}

export enum TBoardPattern {
  line = 'line',
  arrow = 'arrow',
  rect = 'rect',
  slect = 'select',
  text = 'text'
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

  draggable: boolean;
  scale: number;
}

export const couldDraggable: TBoardPattern[] = [
  TBoardPattern.rect,
  TBoardPattern.slect,
  TBoardPattern.text
];

const initialState: IState = {
  boardBgColor: '#fff',
  boardPattern: TBoardPattern.line,
  leftSideTool: LeftToolPattern.board,
  boardSize: {
    width: 300,
    height: 150
  },
  maxBoardSize: null,
  scale: 1,
  draggable: false
};

const brushSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardPattern(state, action) {
      state.boardPattern = action.payload;
      state.draggable = couldDraggable.includes(action.payload) ? true : false;
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
