import { configureStore } from '@reduxjs/toolkit';
import boardSlice from './feature/boardSlice';
import brushSlice from './feature/brushSlice';

export default configureStore({
  reducer: {
    brush: brushSlice,
    board: boardSlice
  }
});
