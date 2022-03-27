import React from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import AppLayout from './layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
