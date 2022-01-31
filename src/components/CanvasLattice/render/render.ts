import { Flags } from "../../../domain/cell";
import { Lattice } from "../../../domain/lattice";
import { Runner } from "../../../domain/Runner";
import { ColorMap } from "./colorMap";

export enum PlotTypes {
  rho = "rho",
  ux = "ux",
  uy = "uy",
  speed = "speed",
  curl = "curl",
  mass = "mass",
  alpha = "alpha",
}

export const getContext = (
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D => {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No 2D Context");
  }
  context.imageSmoothingEnabled = false;
  return context;
};

export const getImage = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
): ImageData => {
  const image = context.createImageData(x, y); // for direct pixel manipulation (faster than fillRect)
  for (let i = 3; i < image.data.length; i += 4) {
    image.data[i] = 255;
  }
  return image;
};

// Color a grid square in the image data array, one pixel at a time (rgb each in range 0 to 255):
const colorSquare = (
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  ydim: number,
  image: ImageData,
) => {
  // put y=0 at the bottom
  const flippedy = ydim - y - 1;
  for (let py = flippedy; py < flippedy + 1; py++) {
    for (let px = x; px < x + 1; px++) {
      const index = (px + py * image.width) * 4;
      image.data[index + 0] = r;
      image.data[index + 1] = g;
      image.data[index + 2] = b;
    }
  }
};

// Paint the canvas:
export function render(
  colorMap: ColorMap,
  contrast: number,
  plotType: PlotTypes,
  lattice: Lattice,
  context: CanvasRenderingContext2D,
  image: ImageData,
  canvas: HTMLCanvasElement,
  fps: number,
  ups: number,
): void {
  let cIndex = 0;
  const { nColors } = colorMap;
  const { x: xdim, y: ydim } = lattice;
  for (let y = 0; y < ydim; y++) {
    for (let x = 0; x < xdim; x++) {
      const flag = lattice.flag[x + y * xdim];
      if (flag === Flags.barrier) {
        // kludge for barrier color which isn't really part of color map
        cIndex = nColors + 1;
      } else if (flag === Flags.gas) {
        cIndex = nColors + 3;
      } else if (flag === Flags.source) {
        cIndex = nColors + 4;
        //   } else if (flag === Flags.interface) {
        //     cIndex = nColors + 2;
      } else {
        if (plotType == PlotTypes.rho) {
          cIndex = Math.round(
            nColors * ((lattice.rho[x + y * xdim] - 1) * 6 * contrast + 0.5),
          );
        } else if (plotType == PlotTypes.ux) {
          cIndex = Math.round(
            nColors * (lattice.ux[x + y * xdim] * 2 * contrast + 0.5),
          );
        } else if (plotType == PlotTypes.uy) {
          cIndex = Math.round(
            nColors * (lattice.uy[x + y * xdim] * 2 * contrast + 0.5),
          );
        } else if (plotType == PlotTypes.speed) {
          const speed = Math.sqrt(
            lattice.ux[x + y * xdim] * lattice.ux[x + y * xdim] +
              lattice.uy[x + y * xdim] * lattice.uy[x + y * xdim],
          );
          cIndex = Math.round(nColors * (speed * 4 * contrast));
        } else if (plotType == PlotTypes.mass) {
          cIndex = Math.round(
            nColors * ((0.5 - lattice.m[x + y * xdim]) * contrast),
          );
        } else if (plotType == PlotTypes.alpha) {
          cIndex = Math.round(
            nColors * ((lattice.alpha[x + y * xdim] - 1) * 6 * contrast + 0.5),
          );
        } else {
          cIndex = Math.round(
            nColors * (lattice.curl[x + y * xdim] * 5 * contrast + 0.5),
          );
        }
        if (cIndex < 0) cIndex = 0;
        if (cIndex > nColors) cIndex = nColors;
      }
      colorSquare(
        x,
        y,
        colorMap.redList[cIndex],
        colorMap.greenList[cIndex],
        colorMap.blueList[cIndex],
        ydim,
        image,
      );
    }
  }
  //if (pixelGraphics)
  createImageBitmap(image).then(function(imgBitmap) {
    context.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, 100, 100);
    context.fillStyle = "#ffffff";
    context.fillText(`UPS: ${ups}`, 5, 10);
    context.fillText(`FPS: ${fps}`, 5, 10 + 15 * 1);
    context.fillText(`mTot: ${lattice.totalMass.toFixed(2)}`, 5, 10 + 15 * 2);
    context.fillText(`dMin: ${lattice.minRho.toFixed(2)}`, 5, 10 + 15 * 3);
    context.fillText(`dMax: ${lattice.maxRho.toFixed(2)}`, 5, 10 + 15 * 4);
    context.fillText(`fluid: ${lattice.fluidCellCount}`, 5, 10 + 15 * 5);
    context.fillText(`inter: ${lattice.interfaceCellCount}`, 5, 10 + 15 * 6);
  });
}

export const run = (
  colorMap: ColorMap,
  contrast: number,
  plotType: PlotTypes,
  lattice: Lattice,
  context: CanvasRenderingContext2D,
  image: ImageData,
  canvas: HTMLCanvasElement,
  getFps: () => number,
  getUps: () => number,
): Runner => {
  const runner = new Runner(
    () =>
      render(
        colorMap,
        contrast,
        plotType,
        lattice,
        context,
        image,
        canvas,
        getFps(),
        getUps(),
      ),
    60,
    true,
  );
  return runner;
};
