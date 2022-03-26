import { setCanvas, setCtx } from '@/store/feature/boardSlice';
import { Dispatch } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';

type MouseXY = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type MouseCbRetuen = {
  ctx: CanvasRenderingContext2D;
  curInfo: MouseXY;
  lastInfo: MouseXY;
};

export const useCanvasInit = (
  wrapDom: HTMLDivElement,
  dispatch: Dispatch<any>
) => {
  React.useEffect(() => {
    if (wrapDom) {
      // 创建canvas画布
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.height = wrapDom.clientHeight;
      canvas.width = wrapDom.clientWidth;
      canvas.style.background = '#fff';
      wrapDom.appendChild(canvas);
      dispatch(setCanvas(canvas));
      dispatch(setCtx(ctx));
    }
  }, [wrapDom, dispatch]);
};

export const useCanvasMouseMoveEvent = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  mouseMoveCallback: (data: MouseCbRetuen) => void
) => {
  useEffect(() => {
    let lastInfo = { clientX: 0, clientY: 0 };
    let isMouseDown = false;
    const windowToCanvas = (x: number, y: number) => {
      const bbox = canvas.getBoundingClientRect();
      return {
        clientX: Math.round(x - bbox.left),
        clientY: Math.round(y - bbox.top)
      };
    };
    const mousedown = (e: MouseEvent) => {
      isMouseDown = true;
      lastInfo = windowToCanvas(e.clientX, e.clientY);
    };
    const mouseup = (e: MouseEvent) => {
      isMouseDown = false;
    };

    const mouseout = (e: MouseEvent) => {
      isMouseDown = false;
    };

    const mousemove = (e: MouseEvent) => {
      if (isMouseDown) {
        let curInfo = windowToCanvas(e.clientX, e.clientY);
        mouseMoveCallback({ ctx, curInfo, lastInfo });
        lastInfo = curInfo;
      }
    };

    canvas?.addEventListener('mousedown', mousedown);
    canvas?.addEventListener('mouseup', mouseup);
    canvas?.addEventListener('mouseout', mouseout);
    canvas?.addEventListener('mousemove', mousemove);

    return () => {
      canvas?.removeEventListener('mousedown', mousedown);
      canvas?.removeEventListener('mouseup', mouseup);
      canvas?.removeEventListener('mouseout', mouseout);
      canvas?.removeEventListener('mousemove', mousemove);
    };
  }, [canvas, ctx, mouseMoveCallback]);
};

export const useCanvasSize = () => {};
