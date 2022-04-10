import Waterfall from '@/components/WaterFull/index';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { List, arrayMove } from 'react-movable';

import './index.css';
import { sideProps } from '../BoardSize';
import { DataContext, DataProp } from '@/App';
import { Input } from 'antd';

// export const splitCode = '*&***&*';

const HandleIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 22 22'
    fill='none'
    stroke='#f2f4f5'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='feather feather-move'
  >
    <polyline points='5 9 2 12 5 15' />
    <polyline points='9 5 12 2 15 5' />
    <polyline points='15 19 12 22 9 19' />
    <polyline points='19 9 22 12 19 15' />
    <line x1='2' y1='12' x2='22' y2='12' />
    <line x1='12' y1='2' x2='12' y2='22' />
  </svg>
);

export const buttonStyles = {
  border: 'none',
  margin: 0,
  padding: 0,
  width: 'auto',
  overflow: 'visible',
  cursor: 'pointer',
  height: '30px',
  marginRight: '5px'
};

const Layers = ({ style }: sideProps) => {
  const { elements, setElements }: DataProp = useContext(DataContext);

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);

  return (
    <div className='' style={{ ...style }}>
      <div>
        <List
          values={elements}
          onChange={({ oldIndex, newIndex }: any) =>
            setElements(arrayMove(elements, oldIndex, newIndex))
          }
          renderList={({ children, props }: any) => (
            <ul {...props}>{children}</ul>
          )}
          renderItem={({ value, props, isDragged, isSelected }) => (
            <li
              {...props}
              style={{
                ...props.style,
                padding: '4px',
                margin: '0.3em 0em',
                listStyleType: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow:
                  ' 0 0 0 1px rgb(17 20 24 / 40%), 0 0 0 rgb(17 20 24 / 0%), 0 0 0 rgb(17 20 24 / 0%)',
                borderRadius: '3px',
                cursor: isDragged ? 'grabbing' : 'inherit',
                fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                backgroundColor:
                  isDragged || isSelected ? 'rgba(0, 161, 255, 0.2)' : '#383e47'
              }}
            >
              <div>
                <button
                  data-movable-handle
                  style={{
                    ...buttonStyles,
                    cursor: isDragged ? 'grabbing' : 'grab'
                  }}
                  tabIndex={-1}
                >
                  <HandleIcon />
                </button>
                <span style={{ color: '#f6f7f9' }}>{value.shapeType}</span>
              </div>

              <div>
                <input
                  style={{ width: '80px' }}
                  defaultValue={value.shapeProps.name || '未命名'}
                />
              </div>
            </li>
          )}
        />
      </div>
    </div>
  );
};

export default Layers;
