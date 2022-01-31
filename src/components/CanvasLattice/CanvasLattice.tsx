import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Lattice, run as runSimulation } from "../../domain/lattice";
import { Runner } from "../../domain/Runner";
import { getJetColorMap, getOceanColorMap } from "./render/colorMap";
import {
  getContext,
  getImage,
  PlotTypes,
  run as runRendering,
} from "./render/render";

export type CanvasLatticeProps = {
  lattice: Lattice;
  viscosity?: number;
  gravity?: number;
  plotType?: PlotTypes;
  width?: number;
  height?: number;
};

export const CanvasLattice = ({
  lattice: initialLattice,
  viscosity = 0.02,
  gravity = 0.01,
  plotType = PlotTypes.rho,
  width = 800,
  height = 320,
}: CanvasLatticeProps): JSX.Element => {
  const [lattice, setLattice] = useState(cloneDeep(initialLattice));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [runner] = useState(runSimulation(lattice, viscosity, gravity));
  const [renderer, setRenderer] = useState<Runner>();

  const handleClickExport = useCallback(() => {
    console.log(JSON.stringify(lattice));
  }, []);

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = getContext(canvas);
    const image = getImage(context, lattice.x, lattice.y);
    const colorMap = getOceanColorMap();
    const contrast = 1;
    const _renderer = runRendering(
      colorMap,
      contrast,
      plotType,
      lattice,
      context,
      image,
      canvas,
      () => _renderer.ups,
      () => runner.ups,
    );
    setRenderer(_renderer);
  }, []);

  useEffect(() => {
    if (!renderer) {
      return;
    }
    renderer.start();
    runner.start();
    return () => {
      renderer.stop();
      runner.stop();
    };
  }, [runner, renderer]);

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} />
      <input type="button" onClick={handleClickExport} value="export" />
    </>
  );
};
