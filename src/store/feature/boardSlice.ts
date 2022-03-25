import { createSlice } from '@reduxjs/toolkit';

export enum TBoardPattern {
  brush = 'brush'
}

interface IState {
  status: string;
  error: string | undefined;
  boardPattern: TBoardPattern;
}

const initialState: IState = {
  status: 'idel',
  error: undefined,
  boardPattern: TBoardPattern.brush
};

const brushSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardPattern(state, action) {
      state.boardPattern = action.payload;
    }
  }
});

export const { setBoardPattern } = brushSlice.actions;

export default brushSlice.reducer;

// 获取画板数据
export const getBoardSetting = (state: any): IState => state.board;
