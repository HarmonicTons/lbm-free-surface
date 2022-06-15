import { clamp } from "lodash";

export enum Direction {
  NW = "NW",
  N = "N",
  NE = "NE",
  W = "W",
  C = "C",
  E = "E",
  SW = "SW",
  S = "S",
  SE = "SE",
}

export enum Flags {
  barrier = "barrier",
  fluid = "fluid",
  gas = "gas",
  interface = "interface",
  source = "source",
}

export type Distributions = Record<Direction, number>;

export const calculateRho = (
  NW: number,
  N: number,
  NE: number,
  W: number,
  C: number,
  E: number,
  SW: number,
  S: number,
  SE: number,
): number => {
  return NW + N + NE + W + C + E + SW + S + SE;
};

export const calculateUx = (
  NW: number,
  NE: number,
  W: number,
  E: number,
  SW: number,
  SE: number,
  rho: number,
): number => {
  return rho === 0 ? 0 : (E + NE + SE - W - NW - SW) / rho;
};

export const calculateUy = (
  NW: number,
  N: number,
  NE: number,
  SW: number,
  S: number,
  SE: number,
  rho: number,
): number => {
  return rho === 0 ? 0 : (N + NW + NE - S - SW - SE) / rho;
};

export const getEquilibriumDistribution = (
  rho: number,
  ux: number,
  uy: number,
): Distributions => {
  const ux3 = 3 * ux;
  const uy3 = 3 * uy;
  const ux2 = ux * ux;
  const uy2 = uy * uy;
  const uxuy2 = 2 * ux * uy;
  const u2 = ux2 + uy2;
  const u215 = 1.5 * u2;
  return {
    C: (4 / 9) * rho * (1 - u215),
    E: (1 / 9) * rho * (1 + ux3 + 4.5 * ux2 - u215),
    W: (1 / 9) * rho * (1 - ux3 + 4.5 * ux2 - u215),
    N: (1 / 9) * rho * (1 + uy3 + 4.5 * uy2 - u215),
    S: (1 / 9) * rho * (1 - uy3 + 4.5 * uy2 - u215),
    NE: (1 / 36) * rho * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215),
    SE: (1 / 36) * rho * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215),
    NW: (1 / 36) * rho * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215),
    SW: (1 / 36) * rho * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215),
  };
};

export const getGravityForce = (
  g: number,
  rho: number,
  ux: number,
  uy: number,
): Distributions => {
  return {
    C: (4 / 3) * rho * g * uy,
    E: (1 / 3) * rho * g * uy,
    N: (-1 / 3) * rho * g * (2 * uy + 1),
    W: (1 / 3) * rho * g * uy,
    S: (-1 / 3) * rho * g * (2 * uy - 1),
    NE: (-1 / 12) * rho * g * (3 * ux + 2 * uy + 1),
    NW: (-1 / 12) * rho * g * (-3 * ux + 2 * uy + 1),
    SW: (-1 / 12) * rho * g * (3 * ux + 2 * uy - 1),
    SE: (1 / 12) * rho * g * (3 * ux - 2 * uy + 1),
  };
};

export const calculateOmega = (viscosity: number): number =>
  1 / (3 * viscosity + 0.5);

export const collide = (
  NW: number,
  N: number,
  NE: number,
  W: number,
  C: number,
  E: number,
  SW: number,
  S: number,
  SE: number,
  rho: number,
  ux: number,
  uy: number,
  m: number,
  viscosity: number,
  gravity: number,
): Distributions => {
  const {
    NW: NWeq,
    N: Neq,
    NE: NEeq,
    W: Weq,
    C: Ceq,
    E: Eeq,
    SW: SWeq,
    S: Seq,
    SE: SEeq,
  } = getEquilibriumDistribution(rho, ux, uy);
  const {
    NW: NWg,
    N: Ng,
    NE: NEg,
    W: Wg,
    C: Cg,
    E: Eg,
    SW: SWg,
    S: Sg,
    SE: SEg,
  } = getGravityForce(gravity, m, ux, uy);
  const omega = calculateOmega(viscosity);
  return {
    C: clamp(C + omega * (Ceq - C) + Cg, 0, 8 / 9),
    E: clamp(E + omega * (Eeq - E) + Eg, 0, 2 / 9),
    W: clamp(W + omega * (Weq - W) + Wg, 0, 2 / 9),
    N: clamp(N + omega * (Neq - N) + Ng, 0, 2 / 9),
    S: clamp(S + omega * (Seq - S) + Sg, 0, 2 / 9),
    NE: clamp(NE + omega * (NEeq - NE) + NEg, 0, 1 / 18),
    SE: clamp(SE + omega * (SEeq - SE) + SEg, 0, 1 / 18),
    NW: clamp(NW + omega * (NWeq - NW) + NWg, 0, 1 / 18),
    SW: clamp(SW + omega * (SWeq - SW) + SWg, 0, 1 / 18),
  };
};
