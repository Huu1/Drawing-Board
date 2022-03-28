import React, { useState } from 'react';
import { TBoardPattern } from '@/store/feature/boardSlice';
import Konva from 'konva';
import { IRect } from 'konva/lib/types';
let tr: any;
let x1: number, y1: number, x2: number, y2: number;

const useSelectAera = (
  stage: Konva.Stage,
  paintLayer: Konva.Layer,
  backgroundRect: Konva.Rect,
  boardPattern: TBoardPattern
) => {
  const [selectionRectangle, setSelectionRectangle] = useState<Konva.Rect>();

  const handleMouseDown = React.useCallback(
    (e) => {
      // do nothing if we mousedown on any shape
      if (e.target !== stage && e.target !== backgroundRect) {
        return;
      }
      e.evt.preventDefault();
      x1 = stage.getPointerPosition()!.x;
      y1 = stage.getPointerPosition()!.y;
      x2 = stage.getPointerPosition()!.x;
      y2 = stage.getPointerPosition()!.y;

      selectionRectangle?.visible(true);
      selectionRectangle?.width(0);
      selectionRectangle?.height(0);
    },
    [backgroundRect, selectionRectangle, stage]
  );
  const handleMouseMove = React.useCallback(
    (e) => {
      // do nothing if we didn't start selection
      if (!selectionRectangle?.visible()) {
        return;
      }
      e.evt.preventDefault();
      x2 = stage.getPointerPosition()!.x;
      y2 = stage.getPointerPosition()!.y;

      selectionRectangle?.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1)
      });
    },
    [selectionRectangle, stage]
  );
  const handleMouseUp = React.useCallback(
    (e) => {
      // do nothing if we didn't start selection
      if (!selectionRectangle?.visible()) {
        return;
      }
      e.evt.preventDefault();
      // update visibility in timeout, so we can check it in click event
      setTimeout(() => {
        selectionRectangle.visible(false);
      });

      let shapes = stage.find('.rect');

      let box = selectionRectangle.getClientRect();
      let selected = shapes.filter((shape: { getClientRect: () => IRect }) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      tr.nodes(selected);
    },
    [selectionRectangle, stage]
  );

  const handleClick = React.useCallback(
    (e) => {
      // if we are selecting with rect, do nothing
      if (selectionRectangle?.visible()) {
        return;
      }

      // if click on empty area - remove all selections
      if (e.target === stage) {
        tr.nodes([]);
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('rect')) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = tr.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        tr.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target), 1);
        tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = tr.nodes().concat([e.target]);
        tr.nodes(nodes);
      }
    },
    [selectionRectangle, stage]
  );

  React.useEffect(() => {
    if (boardPattern === TBoardPattern.slect) {
      if (!tr) {
        tr = new Konva.Transformer();
        paintLayer?.add(tr);
        let selectionRectangle = new Konva.Rect({
          fill: 'rgba(0,0,255,0.5)',
          visible: false
        });
        paintLayer?.add(selectionRectangle);
        setSelectionRectangle(selectionRectangle);
      }
      stage?.on('mousedown', handleMouseDown);
      stage?.on('mousemove', handleMouseMove);
      stage?.on('mouseup', handleMouseUp);
      stage?.on('click', handleClick);
      return () => {
        console.log('clean up selectAera');
        stage?.off('mousedown', handleMouseDown);
        stage?.off('mousemove', handleMouseMove);
        stage?.off('mouseup', handleMouseUp);
        stage?.off('click', handleClick);
      };
    }
  }, [
    boardPattern,
    handleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    paintLayer,
    stage
  ]);
};

export default useSelectAera;
