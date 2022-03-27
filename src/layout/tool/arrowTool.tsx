import ColorPicker from '@/components/ColorPicker';
import {
  getLineStyle,
  LinePattern,
  setLinePattern,
  setStroke,
  setStrokeWidth
} from '@/store/feature/lineSlice';
import { Col, Radio, Row, Slider, Switch } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ArrowTool = () => {
  const { stroke, strokeWidth, linePattrn } = useSelector(getLineStyle);
  const dispatch = useDispatch();
  return (
    <div>
      <Row justify='space-between' align='middle'>
        <Col span={8} className='text-gray-300'>
          大小
        </Col>
        <Col span={14}>
          <Slider
            min={1}
            max={80}
            value={strokeWidth}
            onChange={(width) => dispatch(setStrokeWidth(width))}
          />
        </Col>
      </Row>
      <Row>
        <ColorPicker
          color={stroke}
          onChange={(color) => dispatch(setStroke(color))}
        />
      </Row>
    </div>
  );
};

ArrowTool.displayName = 'ArrowTool';

export default React.memo(ArrowTool);
