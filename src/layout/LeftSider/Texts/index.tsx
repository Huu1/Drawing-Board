import Waterfall from '@/components/WaterFull/index';
import { Avatar, Divider, List, Skeleton, Spin } from 'antd';
import request from '@/utils/http';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';

import './index.css';
import { sideProps } from '../BoardSize';

// export const splitCode = '*&***&*';

const headers = [
  { title: '标题', className: 'text-2xl' },
  { title: '副标题', className: 'text-xl' },
  { title: '文字', className: 'text-base' }
];

const Texts = ({ style }: sideProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, text: string) => {
    e.dataTransfer.setData('text/plain', text);
  };

  return (
    <div className='' style={{ ...style }}>
      <div style={{ height: '40px' }} className='recommend-size-container'>
        {headers.map((i, index) => {
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e, i.title)}
              className={` recommend-size-item cursor-pointer ${i.className} text-center	`}
              style={{ padding: '5px' }}
            >
              {i.title}
            </div>
          );
        })}
      </div>

      <div></div>
    </div>
  );
};

export default Texts;
