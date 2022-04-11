import ColorPicker from '@/components/ColorPicker';
import { Col, Row, Slider } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BrushTool = () => {
  // const { brushWidth, brushColor } = useSelector(getBrushSetting);
  const dispatch = useDispatch();
  return (
    <div>
      {/* <Row justify='space-between' align='middle'>
        <Col span={8} className='text-gray-300'>
          画笔粗细
        </Col>
        <Col span={14}>
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
      </Row> */}
    </div>
  );
};

BrushTool.displayName = 'BrushTool';

export default React.memo(BrushTool);
