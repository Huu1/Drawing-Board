import useClientRect from '@/Hooks/useClient';
import * as React from 'react';

let canvas: HTMLCanvasElement;

export default function Home() {
  const [canvasWrapDOM, ref] = useClientRect();
  // const [ctx, setCanvas] = React.useState<CanvasRenderingContext2D | null>();

  React.useEffect(() => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let lastInfo = { x: 0, y: 0 };
    const windowToCanvas = (x: number, y: number) => {
      const bbox = canvas.getBoundingClientRect();
      return { x: Math.round(x - bbox.left), y: Math.round(y - bbox.top) };
    };
    let isMouseDown = false;

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      isMouseDown = true;
      lastInfo = windowToCanvas(e.clientX, e.clientY);
    });
    canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (isMouseDown) {
        let curInfo = windowToCanvas(e.clientX, e.clientY);

        ctx.beginPath();
        ctx.moveTo(lastInfo.x, lastInfo.y);
        ctx.lineTo(curInfo.x, curInfo.y);

        ctx.strokeStyle = 'red';
        ctx.stroke();

        lastInfo = curInfo;
      }
    });
    canvas.addEventListener('mouseout', () => {
      isMouseDown = false;
    });
  }, []);

  React.useEffect(() => {
    const resize = () => {
      canvas.width = (canvasWrapDOM as HTMLElement).clientWidth;
      canvas.height = (canvasWrapDOM as HTMLElement).clientHeight;
    };
    if (canvas && canvasWrapDOM) {
      resize();
      window.addEventListener('resize', resize);
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [canvasWrapDOM]);

  return (
    <div
      ref={ref as React.LegacyRef<HTMLDivElement>}
      style={{ height: '100%' }}
    >
      <canvas id='canvas'></canvas>
    </div>
  );
}
