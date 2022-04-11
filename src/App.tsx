import React, { useState } from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import AppLayout from './layout/AppLayout';
import { Test } from './page/test';
import { ImageElement } from './components/Image';
import { TextElementProps } from './components/Text';

export type DataProp = {
  elements: Array<ImageElement | TextElementProps>;
  setElements: Function;
  selectedId: string | null;
  selectShape: Function;
};

const data: DataProp = {
  elements: [],
  setElements: () => {},
  selectedId: null,
  selectShape: () => {}
};

export const DataContext = React.createContext(data);

function App() {
  const [elements, setElements] = useState<
    Array<ImageElement | TextElementProps>
  >([]);
  const [selectedId, selectShape] = useState(null);

  return (
    <DataContext.Provider
      value={{ elements, setElements, selectedId, selectShape }}
    >
      <AppLayout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/test' element={<Test />} />
        </Routes>
      </AppLayout>
    </DataContext.Provider>
  );
}

export default App;
