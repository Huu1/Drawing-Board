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

const LineTool = () => {
  const { stroke, strokeWidth, linePattrn } = useSelector(getLineStyle);
  const dispatch = useDispatch();
  return (
    <div>
      <Radio.Group
        defaultValue={linePattrn}
        buttonStyle='solid'
        onChange={(e) => dispatch(setLinePattern(e.target.value))}
      >
        <Radio.Button value={LinePattern.line}>默认</Radio.Button>
        <Radio.Button value={LinePattern.straight}>直线</Radio.Button>
        <Radio.Button value={LinePattern.dash}>虚线</Radio.Button>
      </Radio.Group>
      <Row justify='space-between' align='middle'>
        <Col span={8} className='text-gray-300'>
          画笔大小
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

LineTool.displayName = 'LineTool';

export default React.memo(LineTool);
