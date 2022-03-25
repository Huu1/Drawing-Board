import { Radio } from 'antd';
import React from 'react';

export function Header(props: any) {
  return (
    <div className='h-10	px-4 py-1	'>
      <Radio.Group defaultValue='board' buttonStyle='solid'>
        <Radio.Button value='board'>画板</Radio.Button>
        <Radio.Button value='brush'>画笔</Radio.Button>
        <Radio.Button value='revoke'>撤销</Radio.Button>
        <Radio.Button value='recovery'>恢复</Radio.Button>
        <Radio.Button value='eraser'>橡皮擦</Radio.Button>
        <Radio.Button value='trash'>删除</Radio.Button>
      </Radio.Group>
    </div>
  );
}
