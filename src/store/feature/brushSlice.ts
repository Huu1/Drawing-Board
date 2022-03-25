import { createSlice } from '@reduxjs/toolkit';

interface IState {
  status: string;
  error: string | undefined;
  brushWidth: number;
  brushColor: string;
}

const initialState: IState = {
  status: 'idel',
  error: undefined,
  brushWidth: 1,
  brushColor: 'black'
};

const brushSlice = createSlice({
  name: 'brush',
  initialState,
  reducers: {
    setBrushColor(state, action) {
      state.brushColor = action.payload;
    },
    setBrushWidth(state, action) {
      state.brushWidth = action.payload;
    }
  }
});

export const { setBrushColor, setBrushWidth } = brushSlice.actions;

export default brushSlice.reducer;

// 获取画笔数据
export const getBrushSetting = (state: any): IState => state.brush;
