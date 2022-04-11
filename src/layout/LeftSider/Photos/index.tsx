import Waterfall from '@/components/WaterFull/index';
import { Avatar, Divider, List, Skeleton, Spin } from 'antd';
import request from '@/utils/http';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';

import './index.css';
import { sideProps } from '../BoardSize';

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
      url: 'https://api.unsplash.com/photos/random?count=20',
      method: 'get',
      headers: {
        Authorization: 'Client-ID Rc6PKQTVJIzf-UUo-7BEFqcxPpC6ZaK8JXOygsrFtGk'
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
    console.log('xxxx');
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
          hasMore={data.length < 100}
          scrollableTarget='scrollableDiv'
        >
          <div className='masonry'>
            {data.length > 0 &&
              data.map((item, index) => {
                return (
                  <LazyLoad key={index} once className='item'>
                    <img
                      src={item.urls.small}
                      alt=''
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, item.urls.regular, item)
                      }
                    />
                  </LazyLoad>
                );
              })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Photos;
