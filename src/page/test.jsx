import React, { useEffect, useRef } from "react";
import "./index.css";
let isSmall = false;
let timer;
export function Test() {
  const ref = useRef();
  useEffect(() => {
    const callbackFunction = ([e]) => {
      console.log(e.target.clientHeight);
      console.log(e.target.clientWidth);
    };
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.setAttribute("width", ref.current.clientWidth + "px");
    canvas.setAttribute("height", ref.current.clientHeight + "px");
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(200, 500);

    ctx.strokeStyle = "blck";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true };

    // 当观察到变动时执行的回调函数
    const callback = function ([{ target }], observer) {
      if (isSmall) {
        canvas.setAttribute("width", target.clientWidth * 0.8 + "px");
        canvas.setAttribute("height", target.clientHeight * 0.8 + "px");
      } else {
        canvas.setAttribute("width", target.clientWidth + "px");
        canvas.setAttribute("height", target.clientHeight + "px");
      }

      ctx.putImageData(data, 0, 0);
      data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(ref.current, config);

    // ref.current.addEventListener("wheel", (e) => {
    //   e = e || window.event;
    //   if (e.wheelDelta) {
    //     //判断浏览器IE，谷歌滑轮事件
    //     if (e.wheelDelta > 0) {
    //       ref.current.style.transform = "scale(.8)";
    //       isSmall = false;
    //     }
    //     if (e.wheelDelta < 0) {
    //       ref.current.style.transform = "scale(1)";
    //       isSmall = true;
    //     }

    //   }
    // });
  }, []);

  const add = () => {
    ref.current.style.transform = "scale(1)";
    isSmall = false;
  };
  const mins = () => {
    ref.current.style.transform = "scale(.8)";
    isSmall = true;
  };
  return (
    <>
      <div className="containers" ref={ref}>
        <canvas id="canvas"></canvas>
      </div>
      <button onClick={add}>+</button>
      <button onClick={mins}>-</button>
    </>
  );
}
