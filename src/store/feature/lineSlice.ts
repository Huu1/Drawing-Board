import { createSlice } from '@reduxjs/toolkit';

export enum LinePattern {
  line = 'line',
  straight = 'straight',
  dash = 'dash'
}

interface IState {
  linePattrn: LinePattern;
  strokeWidth: number;
  stroke: string;
  dash: number[];
}

const initialState: IState = {
  linePattrn: LinePattern.line,
  strokeWidth: 1,
  stroke: 'black',
  dash: [20, 10]
};

const lineSlice = createSlice({
  name: 'line',
  initialState,
  reducers: {
    setLinePattern(state, action) {
      state.linePattrn = action.payload;
    },
    setStroke(state, action) {
      state.stroke = action.payload;
    },
    setStrokeWidth(state, action) {
      state.strokeWidth = action.payload;
    }
  }
});

export const { setStroke, setStrokeWidth, setLinePattern } = lineSlice.actions;

export default lineSlice.reducer;

// 获取画笔数据
export const getLineStyle = (state: any): IState => state.line;
