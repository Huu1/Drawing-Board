import { TBoardPattern } from '@/store/feature/boardSlice';
import Konva from 'konva';
import { TextConfig } from 'konva/lib/shapes/Text';
import React, { useCallback, useEffect } from 'react';
import { Rect, Text } from 'react-konva';
import { KonvaTextProps } from './shape';

let tr: Konva.Transformer | null;
let textarea: HTMLTextAreaElement | null = null;

const calcTextPosition = (stageBox: DOMRect, textarea: HTMLTextAreaElement) => {
  return {
    x: parseInt(textarea?.style.left as string, 10) - stageBox.left,
    y: parseInt(textarea?.style.top as string, 10) - stageBox.top
  };
};

const createTextAera = () => {
  let result = document.createElement('textarea');
  result.className = 'text-aera';
  document.body.appendChild(result);
  result.style.position = 'absolute';
  return result;
};

const removeTextAera = () => {
  if (textarea === null) return;
  textarea.parentElement?.removeChild(textarea);
  textarea = null;
};

export const KonvaText = React.memo((props: KonvaTextProps) => {
  const { stage, boardPattern, paintLayertRef } = props;
  const isUpdate = React.useRef(false);
  const [texts, setTexts] = React.useState<TextConfig[]>([]);

  const handleClick = useCallback((e) => {
    const stage = e.target.getStage() as Konva.Stage;
    const point = stage.getPointerPosition();
    let stageBox = stage.container().getBoundingClientRect();
    // then lets find position of stage container on the page:
    if (textarea !== null) {
      const { x, y } = calcTextPosition(stageBox, textarea);
      setTexts((data: TextConfig[]) =>
        [
          ...data,
          {
            x,
            y,
            text: textarea?.value,
            fontSize: 18,
            fill: '#555'
          }
        ].filter((i) => i.text)
      );
      removeTextAera();
    }

    if (e.target === stage || e.target === stage.find('.background')[0]) {
      tr?.nodes([]);
      // so position of textarea will be the sum of positions above:
      const areaPosition = {
        x: stageBox.left + point!.x,
        y: stageBox.top + point!.y
      };
      textarea = createTextAera();
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.top = areaPosition.y + 'px';
      textarea.focus();
    } else {
      tr?.nodes([e.target]);
      tr?.show();
    }
  }, []);

  const handleDbClick = useCallback((e) => {
    const oldTextNode = e.target as Konva.TextConfig;
    const shapeName = oldTextNode.getClassName();
    if (shapeName !== 'Text') {
      return;
    }
    tr?.hide();

    const stage = oldTextNode.getStage() as Konva.Stage;
    const textPosition = oldTextNode.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    let textNode = oldTextNode.clone();
    oldTextNode.destroy();

    // // so position of textarea will be the sum of positions above:
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y
    };

    textarea = createTextAera();
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    let rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    let px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();
  }, []);

  useEffect(() => {
    if (boardPattern === TBoardPattern.text) {
      tr = new Konva.Transformer();
      paintLayertRef?.add(tr);
      stage?.on('click', handleClick);
      stage?.on('dblclick', handleDbClick);
    }
    return () => {
      tr?.destroy();
      tr = null;
      stage?.off('click', handleClick);
      stage?.off('dblclick', handleDbClick);
      removeTextAera();
    };
  }, [boardPattern, stage, paintLayertRef, handleClick, handleDbClick]);
  return (
    <>
      {texts.map((text: TextConfig, i: number) => (
        <Text
          key={i}
          x={text.x}
          y={text.y}
          text={text.text}
          fontSize={text.fontSize}
          fill={text.fill}
          shadowBlur={text.shadowBlur}
          cornerRadius={text.cornerRadius}
          draggable={props.draggable}
          name='text'
        />
      ))}
    </>
  );
});
