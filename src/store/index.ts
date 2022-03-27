import { configureStore } from '@reduxjs/toolkit';
import arrowSlice from './feature/arrowSlice';
import boardSlice from './feature/boardSlice';
import lineSlice from './feature/lineSlice';

export default configureStore({
  reducer: {
    board: boardSlice,
    line: lineSlice,
    arrow: arrowSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
