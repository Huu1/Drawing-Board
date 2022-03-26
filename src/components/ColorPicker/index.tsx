import useClickOutside from '@/Hooks/useOutSide';
import * as React from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import { BgColorsOutlined } from '@ant-design/icons';

import './index.css';

interface ColorPickerProps {
  onChange: (newColor: string) => void;
  color: string;
}

const defaultColorList: string[] = [
  '#38b6ff',
  '#8c52ff',
  '#cb6ce6',
  '#7ed957',
  '#c9e265',
  '#ff914d',
  '#ff66c4',
  '#000000',
  '#ffffff'
];

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const popover = React.useRef();
  const [isOpen, toggle] = React.useState(false);
  const [flag, toggleFlag] = React.useState(false);

  const close = React.useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className='flex flex-wrap'>
      <div
        className={`swatch  relative ${color && !flag ? 'color-checked' : ''}`}
        style={{ backgroundColor: color }}
        onClick={() => {
          toggleFlag(false);
          toggle(true);
        }}
      >
        <BgColorsOutlined />
        {isOpen && (
          <div className='popover' ref={popover as any}>
            <HexColorPicker color={color} onChange={onChange} />
            <HexColorInput color={color} onChange={onChange} />
          </div>
        )}
      </div>
      {defaultColorList.map((c, index) => {
        return (
          <div
            key={c}
            className={`swatch mr-2 ${!index ? 'ml-2' : ''} ${
              c === color && flag ? 'color-checked' : ''
            }`}
            style={{ backgroundColor: c }}
            onClick={() => {
              toggleFlag(true);
              onChange(c);
            }}
          />
        );
      })}
    </div>
  );
};

export default ColorPicker;
