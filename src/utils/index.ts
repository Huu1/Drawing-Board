export const windowToCanvas = (x: number, y: number) => {};

// 增加前缘触发功能
export function debounce(fn: Function, wait: number, immediate = false) {
  let timer: NodeJS.Timer | null,
    startTimeStamp = 0;
  let context: any, args: IArguments;

  let run = (timerInterval: number) => {
    timer = setTimeout(() => {
      let now = new Date().getTime();
      let interval = now - startTimeStamp;
      if (interval < timerInterval) {
        // the timer start time has been reset，so the interval is less than timerInterval
        // console.log('debounce reset', timerInterval - interval);
        startTimeStamp = now;
        run(wait - interval); // reset timer for left time
      } else {
        if (!immediate) {
          fn.apply(context, args);
        }
        timer && clearTimeout(timer);
        timer = null;
      }
    }, timerInterval);
  };

  return function () {
    args = arguments;
    let now = new Date().getTime();
    startTimeStamp = now; // set timer start time

    if (!timer) {
      if (immediate) {
        fn.apply(null, args);
      }
      run(wait); // last timer alreay executed, set a new timer
    }
  };
}
