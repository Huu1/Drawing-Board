import { createSlice } from '@reduxjs/toolkit';
import Konva from 'konva';

interface IState {}

const initialState: IState = {};

const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {}
});

export const {} = selectSlice.actions;

export default selectSlice.reducer;

export const getSelectSetting = (state: any): IState => state.select;
