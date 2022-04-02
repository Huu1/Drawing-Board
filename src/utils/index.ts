export const windowToCanvas = (x: number, y: number) => {};
/**
 *
 * @param widthOffset 高度距离两边距离
 * @param heightOffset 高度距离两边距离
 * @param stageWidth 舞台宽
 * @param stageHeight 舞台高
 * @param boarwidth 画板宽
 * @param boarheight 画板高
 * @returns
 */
export const containResize = (
  stageWidth: number,
  stageHeight: number,
  boarwidth: number,
  boarheight: number
) => {
  let width = stageWidth,
    height = stageHeight;
  if (
    boarwidth > boarheight ||
    (boarwidth === boarheight && stageWidth < stageHeight)
  ) {
    height = (boarheight * width) / boarwidth;
  } else if (
    boarwidth < boarheight ||
    (boarwidth === boarheight && stageWidth > stageHeight)
  ) {
    width = (boarwidth * height) / boarheight;
  }
  return {
    width,
    height
  };
};

export const setRatioCenter = (
  width: number,
  height: number,
  stageWidth: number,
  stageHeight: number,
  boardWidth: number,
  boardHeight: number
) => {
  const widthMargin = 20;
  const heightMargin = 60;

  let ratio = 1;
  if (width === height) {
    ratio = (width - widthMargin) / boardWidth;
    if (stageHeight - heightMargin < ratio * boardHeight) {
      ratio = (stageHeight - heightMargin) / boardHeight;
    }
  } else if (width === stageWidth) {
    ratio = (width - widthMargin) / boardWidth;
    if (stageHeight - heightMargin < ratio * boardHeight) {
      ratio = (stageHeight - heightMargin) / boardHeight;
    }
  } else if (height === stageHeight) {
    ratio = (height - heightMargin) / boardHeight;
    if (stageWidth - widthMargin < ratio * boardWidth) {
      ratio = (stageWidth - widthMargin) / boardWidth;
    }
  } else {
    console.log('otherrrrrrrrr');
  }

  let x: number, y: number;
  x = (stageWidth - boardWidth * ratio) / 2;
  y = (stageHeight - boardHeight * ratio) / 2;

  return {
    ratio,
    x,
    y
  };
};
