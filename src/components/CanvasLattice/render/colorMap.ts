export interface ColorMap {
  nColors: number;
  redList: number[];
  greenList: number[];
  blueList: number[];
}

// Set up the array of colors for plotting (mimicks matplotlib "jet" colormap):
// (Kludge: Index nColors+1 labels the color used for drawing barriers.)
// there are actually nColors+2 colors
export const getColorMap = (nColors = 400): ColorMap => {
  const colorMap = {
    nColors,
    redList: new Array(nColors + 2),
    greenList: new Array(nColors + 2),
    blueList: new Array(nColors + 2),
  };

  for (let c = 0; c <= nColors; c++) {
    let r, g, b;
    if (c < nColors / 8) {
      r = 0;
      g = 0;
      b = Math.round((255 * (c + nColors / 8)) / (nColors / 4));
    } else if (c < (3 * nColors) / 8) {
      r = 0;
      g = Math.round((255 * (c - nColors / 8)) / (nColors / 4));
      b = 255;
    } else if (c < (5 * nColors) / 8) {
      r = Math.round((255 * (c - (3 * nColors) / 8)) / (nColors / 4));
      g = 255;
      b = 255 - r;
    } else if (c < (7 * nColors) / 8) {
      r = 255;
      g = Math.round((255 * ((7 * nColors) / 8 - c)) / (nColors / 4));
      b = 0;
    } else {
      r = Math.round((255 * ((9 * nColors) / 8 - c)) / (nColors / 4));
      g = 0;
      b = 0;
    }
    colorMap.redList[c] = r;
    colorMap.greenList[c] = g;
    colorMap.blueList[c] = b;
  }
  // black barriers
  colorMap.redList[nColors + 1] = 0;
  colorMap.greenList[nColors + 1] = 0;
  colorMap.blueList[nColors + 1] = 0;
  // red interfaces
  colorMap.redList[nColors + 2] = 255;
  colorMap.greenList[nColors + 2] = 0;
  colorMap.blueList[nColors + 2] = 0;
  // white gas
  colorMap.redList[nColors + 3] = 255;
  colorMap.greenList[nColors + 3] = 255;
  colorMap.blueList[nColors + 3] = 255;
  // purple sources
  colorMap.redList[nColors + 4] = 255;
  colorMap.greenList[nColors + 4] = 0;
  colorMap.blueList[nColors + 4] = 255;

  return colorMap;
};
