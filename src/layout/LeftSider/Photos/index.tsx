import Waterfall from '@/components/WaterFull/index';
import { Avatar, Divider, List, Skeleton, Spin } from 'antd';
import request from '@/utils/http';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';

import './index.css';
import { sideProps } from '../BoardSize';
import Masonry from 'react-masonry-css';

export const splitCode = '*&***&*';

const Photos = ({ style }: sideProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);

    request({
      url: 'https://api.unsplash.com/photos/random?count=40',
      method: 'get',
      headers: {
        Authorization: 'Client-ID g0hjw__H3OZAnfkzXMs4GpZZ9MvTmLsRzRufJMQnljI'
      }
    }).then((res: any) => {
      function map(item: any) {
        return item.urls.small;
      }
      setData((data) => {
        // imgStore = [...data, ...res.map(map)];
        return [...data, ...res];
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const onDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    src: string,
    item: any
  ) => {
    const { width, height } = item;

    e.dataTransfer.setData(
      'text/plain',
      Math.round((1080 * height) / width) + splitCode + src
    );
  };

  return (
    <div className='h-full' style={{ ...style }}>
      <div style={{ height: '40px' }}>Photos by Unsplash</div>
      <div
        id='scrollableDiv'
        className='flex-1'
        style={{
          ...style,
          height: 'calc(100% - 40px)',
          overflow: 'hidden auto'
        }}
      >
        <InfiniteScroll
          loader={<Spin />}
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 300}
          scrollableTarget='scrollableDiv'
        >
          <Masonry
            breakpointCols={2}
            className='my-masonry-grid'
            columnClassName='my-masonry-grid_column'
          >
            {/* array of JSX items */}
            {data.map((item, index) => {
              return (
                <div key={index} className='item'>
                  <img
                    src={item.urls.small}
                    alt=''
                    draggable
                    onDragStart={(e) => onDragStart(e, item.urls.regular, item)}
                  />
                  <div className='info text-center'>
                    Photo by <span>{item.user.name}</span> on
                    <span>Unsplash</span>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Photos;
