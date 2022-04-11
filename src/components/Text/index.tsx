import { ShpaeType } from '@/page/Home';
import Konva from 'konva';
import React, { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Image, KonvaNodeEvents, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { Html } from 'react-konva-utils';

export type XY = { x: number; y: number };

export type TextElementProps = {
  shapeProps: Konva.TextConfig;
  ratio: XY;
  src: string;
  id: number;
  shapeType: ShpaeType;
};

export type TextProps = TextElementProps & {
  onChange: Function;
  scale: XY;
  onSelect: any;
};
const TextElement = ({
  shapeProps,
  onChange,
  scale,
  onSelect,
  id
}: TextProps) => {
  const shapeRef = useRef<Konva.Text>();

  useEffect(() => {
    onSelect();
  }, []);

  function onDblClick() {
    const textNode = shapeRef.current as Konva.Text;
    const stage = textNode.getStage() as Konva.Stage;

    onSelect(null);
    onChange({
      ...shapeProps,
      visible: false
    });

    let textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    // // // so position of textarea will be the sum of positions above:
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y
    };

    // create textarea and style it
    let textarea = document.createElement('textarea') as HTMLTextAreaElement;
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width =
      textNode.width() * textNode.scaleX() -
      textNode.padding() * textNode.scaleX() * 2 +
      'px';
    textarea.style.height =
      textNode.height() * textNode.scaleY() -
      (textNode.padding() * textNode.scaleX() * 2 + 5) +
      'px';
    textarea.style.fontSize = textNode.fontSize() * textNode.scaleX() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '2px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outlineColor = 'skyblue';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight() + '';
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
      px += 2 + Math.round((textNode.fontSize() * scale.x) / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();

    function removeTextarea() {
      onChange({
        ...shapeProps,
        text: textarea.value,
        visible: true
      });
      setTimeout(() => {
        onSelect();
      });
      textarea.parentNode?.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
    }
    textarea.addEventListener('keydown', function (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        removeTextarea();
      }
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });
    function setTextareaWidth(newWidth: number) {
      // if (!newWidth) {
      //   // set width for placeholder
      //   newWidth = textNode.placeholder.length * textNode.fontSize();
      // }
      // some extra fixes on different browsers
      let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      let isEdge = document.DOCUMENT_NODE || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e: any) {
      let s = textNode.getAbsoluteScale().x;
      setTextareaWidth((shapeProps.width as number) * s);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + 'px';
      const width = textarea.offsetWidth / scale.x;

      onChange({
        ...shapeProps,
        visible: false,
        width,
        height: textarea.clientHeight / scale.y - textNode.fontSize()
      });
    });

    function handleOutsideClick(e: any) {
      if (e.target !== textarea) {
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  }

  return (
    <>
      <Text
        {...shapeProps}
        id={id.toString()}
        onDblClick={onDblClick}
        onDblTap={onDblClick}
        onClick={onSelect}
        onTap={onSelect}
        onMouseDown={onSelect}
        scale={scale}
        ref={shapeRef as React.LegacyRef<Konva.Text>}
        draggable={true}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransform={(e) => {
          // 🚀🚀🚀🚀🚀
          const node = shapeRef.current as Konva.Text;
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * (1 + node.scaleX() - scale.x)
          });
        }}
      />
    </>
  );
};
export default React.memo(TextElement);
