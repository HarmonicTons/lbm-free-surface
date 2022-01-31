export interface ColorMap {
  nColors: number;
  redList: number[];
  greenList: number[];
  blueList: number[];
  alphaList: number[];
}

/**
 * Matplotlib "jet" colormap
 */
export const getJetColorMap = (nColors = 400): ColorMap => {
  const colorMap = {
    nColors,
    redList: new Array(nColors + 3),
    greenList: new Array(nColors + 3),
    blueList: new Array(nColors + 3),
    alphaList: new Array(nColors + 3),
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
    colorMap.alphaList[c] = 1;
  }
  // black barriers
  colorMap.redList[nColors + 1] = 0;
  colorMap.greenList[nColors + 1] = 0;
  colorMap.blueList[nColors + 1] = 0;
  colorMap.alphaList[nColors + 1] = 1;
  // white gas
  colorMap.redList[nColors + 2] = 255;
  colorMap.greenList[nColors + 2] = 255;
  colorMap.blueList[nColors + 2] = 255;
  colorMap.alphaList[nColors + 2] = 0;
  // purple sources
  colorMap.redList[nColors + 3] = 255;
  colorMap.greenList[nColors + 3] = 0;
  colorMap.blueList[nColors + 3] = 255;
  colorMap.alphaList[nColors + 3] = 1;

  return colorMap;
};

/**
 * Ocean color map
 */
export const getOceanColorMap = (nColors = 400): ColorMap => {
  const colorMap = {
    nColors,
    redList: new Array(nColors + 3),
    greenList: new Array(nColors + 3),
    blueList: new Array(nColors + 3),
    alphaList: new Array(nColors + 3),
  };

  for (let c = 0; c <= nColors; c++) {
    let r, g, b;
    if (c < nColors / 2) {
      r = 40;
      g = 90;
      b = 150 + Math.round((255 - 150) * ((c * 2) / nColors));
    } else {
      r = 40 + Math.round((255 - 40) * (((c - nColors / 2) * 2) / nColors));
      g = 90 + Math.round((255 - 90) * (((c - nColors / 2) * 2) / nColors));
      b = 255;
    }
    colorMap.redList[c] = r;
    colorMap.greenList[c] = g;
    colorMap.blueList[c] = b;
    colorMap.alphaList[c] = 1;
  }
  // black barriers
  colorMap.redList[nColors + 1] = 0;
  colorMap.greenList[nColors + 1] = 0;
  colorMap.blueList[nColors + 1] = 0;
  colorMap.alphaList[nColors + 1] = 1;
  // white gas
  colorMap.redList[nColors + 2] = 255;
  colorMap.greenList[nColors + 2] = 255;
  colorMap.blueList[nColors + 2] = 255;
  colorMap.alphaList[nColors + 2] = 0;
  // purple sources
  colorMap.redList[nColors + 3] = 255;
  colorMap.greenList[nColors + 3] = 0;
  colorMap.blueList[nColors + 3] = 255;
  colorMap.alphaList[nColors + 3] = 1;

  return colorMap;
};
