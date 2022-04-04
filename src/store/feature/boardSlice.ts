import { createSlice } from '@reduxjs/toolkit';

// export enum TBoardPattern {
//   brush = 'brush',
//   line = 'line'
// }

// export enum LeftToolPattern {
//   brush = 'brush',
//   board = 'board'
// }

export type BoardSizeType = {
  width: number;
  height: number;
};

// export type ScaleAction = {
//   type: 'zoomIn' | 'zoomOut' | 'scale';
//   payload?: number;
// };

interface IState {
  // 画板尺寸
  boardSize: BoardSizeType;
  handleScale: number | null;
}

const initialState: IState = {
  boardSize: {
    width: 1920,
    height: 1080
  },
  handleScale: null
};

const brushSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // setBoardPattern(state, action) {
    //   state.boardPattern = action.payload;
    // },
    // setBoardBgColor(state, action) {
    //   state.canvas!.style.backgroundColor = action.payload;
    //   state.boardBgColor = action.payload;
    // },
    // setLeftSideTool(state, action) {
    //   state.leftSideTool = action.payload;
    // },
    setBoardSize(state, action) {
      state.boardSize = action.payload;
    }
    // setMaxBoardSize(state, action) {
    //   state.maxBoardSize = action.payload;
    // },
    // setCanvas(state, action) {
    //   state.canvas = action.payload;
    // },
  }
});

export const {
  setBoardSize
  // setBoardPattern,
  // setBoardBgColor,
  // setLeftSideTool,
  // setMaxBoardSize,
  // setCtx,
  // setCanvas
} = brushSlice.actions;

export default brushSlice.reducer;

// 获取画板数据
export const getBoardSetting = (state: any): IState => state.board;
