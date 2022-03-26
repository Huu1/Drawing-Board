import React from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import AppLayout from './layout/AppLayout';
import { Test } from './page/test';
import Demo from './page/demo';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/test' element={<Test />} />
        <Route path='/demo' element={<Demo />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
