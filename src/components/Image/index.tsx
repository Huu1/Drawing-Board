import { ShpaeType } from '@/page/Home';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Image, KonvaNodeEvents, Rect } from 'react-konva';
import useImage from 'use-image';

export const loadingSufix = '-loading';

function getCrop(
  image: any,
  size: { width: number; height: number },
  clipPosition = 'left-top'
) {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  let x = 0;
  let y = 0;
  if (clipPosition === 'left-top') {
    x = 0;
    y = 0;
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight
  };
}

export type XY = { x: number; y: number };

export type ImageElement = {
  shapeProps: Konva.ImageConfig;
  ratio: XY;
  src: string;
  id: number;
  shapeType: ShpaeType;
  height: number;
};

export type URLImageProps = ImageElement & {
  onChange: Function;
  scale: XY;
  onSelect: any;
};
const URLImage = ({
  shapeProps,
  onChange,
  scale,
  onSelect,
  id,
  height
}: URLImageProps) => {
  const [image, status] = useImage(shapeProps.src);
  const shapeRef = useRef<Konva.Image>();

  useEffect(() => {
    if (status === 'loading') {
      onSelect(id + loadingSufix);
    } else if (status === 'loaded') {
      onSelect();
    }
  }, [status]);

  function applyCrop(pos: string | undefined) {
    const img = shapeRef.current as Konva.Image;
    img.setAttr('lastCropUsed', pos);
    const crop = getCrop(
      img.image(),
      { width: img.width(), height: img.height() },
      pos
    );
    img.setAttrs(crop);
  }

  if (status === 'loading') {
    return (
      <>
        <Rect
          x={shapeProps.x}
          y={shapeProps.y}
          width={1080 * scale.x}
          height={height * scale.y}
          id={id + loadingSufix}
          fill={'skyblue'}
          opacity={0.8}
        />
      </>
    );
  }

  return (
    <Image
      {...shapeProps}
      image={image}
      id={id.toString()}
      onClick={onSelect}
      onTap={onSelect}
      onMouseDown={onSelect}
      scale={scale}
      ref={shapeRef as React.LegacyRef<Konva.Image>}
      draggable={true}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransform={() => {
        const node = shapeRef.current as Konva.Image;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          // set minimal value
          width: node.width() * (1 + scaleX - scale.x),
          height: node.height() * (1 + scaleY - scale.y)
        });
        applyCrop(node.getAttr('lastCropUsed'));
      }}
    />
  );
};
export default React.memo(URLImage);
