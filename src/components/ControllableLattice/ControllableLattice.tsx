import { cloneDeep } from "lodash";
import React, { useCallback, useState } from "react";
import { Direction } from "../../domain/cell";
import {
  collide,
  Lattice as TLattice,
  flagEvolution,
  step,
  stream,
  run,
} from "../../domain/lattice";
import useAnimationFrame from "../hooks/useAnimationFrame";
import { Lattice } from "../Lattice/Lattice";
import { useControllableLatticeStyles } from "./ControllableLattice.styles";

export type ControllableLatticeProps = {
  lattice: TLattice;
  viscosity?: number;
  gravity?: number;
};

const useRender = () => {
  const [, setN] = useState(0);
  const render = useCallback(() => setN(v => v + 1), [setN]);
  return render;
};

export const ControllableLattice = ({
  lattice: initialLattice,
  viscosity = 0.02,
  gravity = 0.01,
}: ControllableLatticeProps): JSX.Element => {
  const classNames = useControllableLatticeStyles();
  const [lattice, setLattice] = useState(cloneDeep(initialLattice));
  const handleClickReset = useCallback(() => {
    setLattice(cloneDeep(initialLattice));
  }, [initialLattice, setLattice]);
  const render = useRender();
  const handleClickCollide = useCallback(() => {
    collide(lattice, viscosity, gravity);
    render();
  }, [lattice, viscosity, gravity, setLattice]);
  const handleClickStream = useCallback(() => {
    stream(lattice);
    render();
  }, [lattice, setLattice]);
  const handleClickFlagEvolution = useCallback(() => {
    flagEvolution(lattice);
    render();
  }, [lattice, setLattice]);
  const handleClickFullStep = useCallback(() => {
    step(lattice, viscosity, gravity);
    render();
  }, [lattice, setLattice, viscosity, gravity]);

  const [selectedCell, setSelectedCell] = useState<number | undefined>();
  const [autoplay, setAutoplay] = useState(false);
  const [runner] = useState(run(lattice, viscosity, gravity));

  useAnimationFrame(() => {
    if (autoplay) {
      render();
    }
  }, [autoplay, lattice, setLattice, viscosity, gravity]);

  const handleClickPlay = useCallback(() => {
    if (autoplay === false) {
      runner.start();
    } else {
      runner.stop();
    }
    setAutoplay(!autoplay);
  }, [autoplay, setAutoplay]);

  return (
    <div className={classNames.container}>
      <Lattice
        lattice={lattice}
        selectedCell={selectedCell}
        onChangeSelectedCell={setSelectedCell}
      />
      <div className={classNames.controllerPanel}>
        <input type="button" value="reset" onClick={handleClickReset} />
        <input type="button" value="collide" onClick={handleClickCollide} />
        <input type="button" value="stream" onClick={handleClickStream} />
        <input
          type="button"
          value="flag evolution"
          onClick={handleClickFlagEvolution}
        />
        <input type="button" value="full step" onClick={handleClickFullStep} />
        <input
          type="button"
          value={autoplay ? "stop" : "play"}
          onClick={handleClickPlay}
        />
        <div>{lattice.totalMass.toFixed(3)}</div>
        {selectedCell && (
          <>
            <div>index: {selectedCell}</div>
            <div>flag: {lattice.flag[selectedCell]}</div>
            <div>rho: {lattice.rho[selectedCell].toFixed(3)}</div>
            <div>m: {lattice.m[selectedCell].toFixed(3)}</div>
            <div>alpha: {lattice.alpha[selectedCell].toFixed(3)}</div>
            <div>ux: {lattice.ux[selectedCell].toFixed(3)}</div>
            <div>uy: {lattice.uy[selectedCell].toFixed(3)}</div>
            <div>
              Distributions:
              {Object.values(Direction).map(dir => (
                <div key={dir}>
                  {dir}: {lattice.distributions[dir][selectedCell].toFixed(3)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
