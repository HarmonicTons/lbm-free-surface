import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Cell } from "../Cell/Cell";
import { Slider } from "../Slider/Slider";
import "./style.css";
import {
  calculateRho,
  calculateUx,
  calculateUy,
  Direction,
  Distributions,
  getEquilibriumDistribution,
} from "../../domain/cell";

const toFixedNumber = (n: number): number => Number(n.toFixed(3));

export const ControllableCell = (): JSX.Element => {
  const [NW, setNW] = useState(0);
  const [N, setN] = useState(0);
  const [NE, setNE] = useState(0);
  const [W, setW] = useState(0);
  const [C, setC] = useState(0);
  const [E, setE] = useState(0);
  const [SW, setSW] = useState(0);
  const [S, setS] = useState(0);
  const [SE, setSE] = useState(0);

  const setEquil = useCallback((rho, ux, uy) => {
    const { C, E, N, NE, NW, S, SE, SW, W } = getEquilibriumDistribution(
      rho,
      ux,
      uy,
    );
    setNW(toFixedNumber(NW));
    setN(toFixedNumber(N));
    setNE(toFixedNumber(NE));
    setW(toFixedNumber(W));
    setC(toFixedNumber(C));
    setE(toFixedNumber(E));
    setSW(toFixedNumber(SW));
    setS(toFixedNumber(S));
    setSE(toFixedNumber(SE));
  }, []);

  useEffect(() => {
    setEquil(1, 0.1, 0);
  }, [setEquil]);

  const distributions = useMemo<Distributions>(
    () => ({
      C,
      E,
      N,
      NE,
      NW,
      S,
      SE,
      SW,
      W,
    }),
    [C, E, N, NE, NW, S, SE, SW, W],
  );

  const rho = useMemo(() => calculateRho(NW, N, NE, W, C, E, SW, S, SE), [
    NW,
    N,
    NE,
    W,
    C,
    E,
    SW,
    S,
    SE,
  ]);

  const ux = useMemo(() => calculateUx(NW, NE, W, E, SW, SE, rho), [
    NW,
    NE,
    W,
    E,
    SW,
    SE,
    rho,
  ]);

  const uy = useMemo(() => calculateUy(NW, N, NE, SW, S, SE, rho), [
    NW,
    N,
    NE,
    SW,
    S,
    SE,
    rho,
  ]);

  const handleChange = useCallback(
    (key: string) => (value: number) => {
      switch (key) {
        case Direction.NW:
          setNW(value);
          break;
        case Direction.N:
          setN(value);
          break;
        case Direction.NE:
          setNE(value);
          break;
        case Direction.W:
          setW(value);
          break;
        case Direction.C:
          setC(value);
          break;
        case Direction.E:
          setE(value);
          break;
        case Direction.SW:
          setSW(value);
          break;
        case Direction.S:
          setS(value);
          break;
        case Direction.SE:
          setSE(value);
          break;
      }
    },
    [],
  );

  const handleClick = useCallback(() => {
    setEquil(rho, ux, uy);
  }, [setEquil, rho, ux, uy]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px", height: "300px" }}>
        <Cell
          ux={ux}
          uy={uy}
          distributions={distributions}
          rho={rho}
          alpha={1}
        />
      </div>
      <div style={{ margin: "10px" }}>
        <div>
          <label htmlFor="input-rho">rho</label>
          <input id="input-rho" value={rho.toFixed(3)} readOnly />
        </div>
        <div>
          <label htmlFor="input-ux">ux</label>
          <input id="input-ux" value={ux.toFixed(3)} readOnly />
        </div>
        <div>
          <label htmlFor="input-uy">uy</label>
          <input id="input-uy" value={uy.toFixed(3)} readOnly />
        </div>
        <input type="button" value="Equilibrate" onClick={handleClick} />
      </div>
      <div style={{ margin: "10px" }}>
        {Object.entries(distributions).map(([key, val]) => (
          <Slider
            value={val}
            label={key}
            key={key}
            onChange={handleChange(key)}
          />
        ))}
      </div>
    </div>
  );
};
