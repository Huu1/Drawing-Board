import ColorPicker from '@/components/ColorPicker';
import {
  getBrushSetting,
  setBrushColor,
  setBrushWidth
} from '@/store/feature/brushSlice';
import { Col, Row, Slider } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BrushTool = () => {
  const { brushWidth, brushColor } = useSelector(getBrushSetting);
  const dispatch = useDispatch();
  return (
    <div>
      <div>画笔</div>
      <Row justify='space-between'>
        <Col span={4}>宽度</Col>
        <Col span={16}>
          <Slider
            min={1}
            max={80}
            value={brushWidth}
            onChange={(width) => dispatch(setBrushWidth(width))}
          />
        </Col>
      </Row>
      <Row>
        <ColorPicker
          color={brushColor}
          onChange={(color) => dispatch(setBrushColor(color))}
        />
      </Row>
    </div>
  );
};

export default React.memo(BrushTool);
