import { createSlice } from '@reduxjs/toolkit';

interface IState {
  strokeWidth: number;
  stroke: string;
  pointerLength: number;
  pointerWidth: number;
  fill: string;
}

const initialState: IState = {
  strokeWidth: 10,
  stroke: 'black',
  fill: 'black',
  pointerWidth: 10,
  pointerLength: 10
};

const arrowSlice = createSlice({
  name: 'arrow',
  initialState,
  reducers: {
    setStroke(state, action) {
      state.stroke = action.payload;
    },
    setStrokeWidth(state, action) {
      state.strokeWidth = action.payload;
    },
    setFill(state, action) {
      state.fill = action.payload;
    },
    pointerWidth(state, action) {
      state.pointerWidth = action.payload;
    },
    pointerLength(state, action) {
      state.pointerLength = action.payload;
    }
  }
});

export const {
  setStroke,
  setStrokeWidth,
  pointerWidth,
  pointerLength,
  setFill
} = arrowSlice.actions;

export default arrowSlice.reducer;

export const getArroowStyle = (state: any): IState => state.arrow;
