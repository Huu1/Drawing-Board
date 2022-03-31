import BrushTool from '@/page/Home/tool/brush';
import { getBoardSetting, LeftToolPattern } from '@/store/feature/boardSlice';
import { Button, Radio } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './index.css';

const sideMemu = [
  { title: '背景', icon: '', value: 'background' },
  { title: 'resize', icon: '', value: 'resize' }
];

const LeftSider = () => {
  const [checked, setChecked] = useState<any>();

  return (
    <div className='flex h-full'>
      <div className='bg-primary flex flex-col '>
        {sideMemu.map((item) => {
          return (
            <div
              key={item.value}
              className={`flex flex-col justify-center	items-center cursor-pointer	side-menu ${
                checked === item.value ? 'side-menu-checked' : ''
              }`}
              onClick={() => setChecked(item.value)}
            >
              <span>22</span>
              <span>{item.title}</span>
            </div>
          );
        })}
      </div>
      {checked && (
        <div className='w-64 relative' id='side-nav'>
          <div
            onClick={() => {
              setChecked(null);
              console.log('xx');
            }}
            className='absolute right-0 top-1/2'
            style={{ right: '-40px', zIndex: 1 }}
          >
            关闭
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LeftSider);
