import IconFont from '@/components/Iconfont';
import BrushTool from '@/page/Home/tool/brush';
import { getBoardSetting } from '@/store/feature/boardSlice';
import { Button, Radio } from 'antd';
import { check } from 'prettier';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import BoardSize from './BoardSize';

import './index.css';
import Photos from './Photos';

enum enumMenu {
  background = 'background',
  size = 'size',
  photo = 'photo'
}

const sideMemu = [
  { title: '背景', icon: '', value: enumMenu.background },
  { title: 'size', icon: '', value: enumMenu.size },
  { title: '照片', icon: '', value: enumMenu.photo }
];

const LeftSider = () => {
  const [checked, setChecked] = useState<any>(enumMenu.photo);
  const ref = useRef<any>();

  const sideToggle = (val?: any) => {
    if (val) {
      ref.current.style.width = '422px';
    } else {
      ref.current.style.width = '72px';
    }
    setChecked(val);
  };

  return (
    <div className='flex h-full bg-primary' id='side' ref={ref}>
      <div className='bg-primary flex flex-col '>
        {sideMemu.map((item) => {
          return (
            <div
              key={item.value}
              className={`flex flex-col justify-center 	items-center cursor-pointer	side-menu ${
                checked === item.value ? 'side-menu-checked' : ''
              }`}
              onClick={() => sideToggle(item.value)}
            >
              <span>22</span>
              <span>{item.title}</span>
            </div>
          );
        })}
      </div>

      <div
        className='relative flex-1 cursor-pointer text-white	'
        id='side-nav'
        style={{
          display: checked ? '' : 'none',
          width: '350px',
          padding: '10px'
        }}
      >
        <BoardSize
          style={{ display: checked === enumMenu.size ? '' : 'none' }}
        />

        <Photos style={{ display: checked === enumMenu.photo ? '' : 'none' }} />
        <div
          onClick={() => sideToggle()}
          className='absolute top-1/2'
          style={{ right: '-12px', zIndex: 1, transform: 'translateY(-50%)' }}
        >
          <svg
            width='15'
            height='96'
            fill='#404854'
            viewBox='0 0 15 96'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M3 0 C3.0011 4.42584 3.9102 9.9 7.2 13.28C7.45 13.4625 7.6 13.6 7.7 13.8048L7.8 13.8C9.8 15.8 11.6 17.6 12.9 19.7C14.0 21.6 14.7 23.9 14.9 27H15V68C15 71.7 14.3 74.3 13.0 76.6C11.7 78.8 9.9 80.5 7.8 82.6344L7.79 82.6C7.6 82.8 7.4507 83 7.27295 83.2127C3.9102 86.5228 3.0011 92.0739 3 95.4938'></path>
          </svg>
          <div className='close'>{'>'}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeftSider);
