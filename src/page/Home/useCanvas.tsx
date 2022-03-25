import React, { useEffect, useState } from 'react';

type MouseXY = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type MouseCbRetuen = {
  ctx: CanvasRenderingContext2D;
  curInfo: MouseXY;
  lastInfo: MouseXY;
};

export const useCanvasInit = (canvasWrapDOM: HTMLElement) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_canvas, setCanvas] = useState<HTMLCanvasElement>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_ctx, setCtx] = useState<CanvasRenderingContext2D>();
  React.useEffect(() => {
    if (canvasWrapDOM) {
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;
      let ctx: CanvasRenderingContext2D;
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = (canvasWrapDOM as HTMLElement).clientWidth;
      canvas.height = (canvasWrapDOM as HTMLElement).clientHeight;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setCanvas(canvas);
      setCtx(ctx);
    }
  }, [canvasWrapDOM]);

  return {
    canvas: _canvas,
    ctx: _ctx
  };
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

    if (canvas && ctx) {
      canvas.addEventListener('mousedown', mousedown);
      canvas.addEventListener('mouseup', mouseup);
      canvas.addEventListener('mouseout', mouseout);
      canvas.addEventListener('mousemove', mousemove);
    }

    return () => {
      canvas?.removeEventListener('mousedown', mousedown);
      canvas?.removeEventListener('mouseup', mouseup);
      canvas?.removeEventListener('mouseout', mouseout);
      canvas?.removeEventListener('mousemove', mousemove);
    };
  }, [canvas, ctx, mouseMoveCallback]);
};
