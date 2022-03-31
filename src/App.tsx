import React from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import AppLayout from './layout/AppLayout';
import { Test } from './page/test';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
