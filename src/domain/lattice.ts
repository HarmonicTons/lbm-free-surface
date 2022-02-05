import {
  Flags,
  collide as collideCell,
  Direction,
  getEquilibriumDistribution,
  calculateRho,
  calculateUx,
  calculateUy,
  Distributions,
} from "./cell";
import { Runner } from "./Runner";

export const DirectionRecord: Record<
  Direction,
  { x: number; y: number; oppositeDir: Direction }
> = {
  [Direction.N]: {
    x: 0,
    y: 1,
    oppositeDir: Direction.S,
  },
  [Direction.S]: {
    x: 0,
    y: -1,
    oppositeDir: Direction.N,
  },
  [Direction.E]: {
    x: 1,
    y: 0,
    oppositeDir: Direction.W,
  },
  [Direction.W]: {
    x: -1,
    y: 0,
    oppositeDir: Direction.E,
  },
  [Direction.NE]: {
    x: 1,
    y: 1,
    oppositeDir: Direction.SW,
  },
  [Direction.SW]: {
    x: -1,
    y: -1,
    oppositeDir: Direction.NE,
  },
  [Direction.NW]: {
    x: -1,
    y: 1,
    oppositeDir: Direction.SE,
  },
  [Direction.SE]: {
    x: 1,
    y: -1,
    oppositeDir: Direction.NW,
  },
  [Direction.C]: {
    x: 0,
    y: 0,
    oppositeDir: Direction.C,
  },
};

export type LatticeDistributions = Record<Direction, Array<number>>;

export type Lattice = {
  // dimensions
  x: number;
  y: number;
  // distributions
  distributions: LatticeDistributions;
  nextDistributions: LatticeDistributions;
  // macro
  rho: Array<number>;
  ux: Array<number>;
  uy: Array<number>;
  m: Array<number>;
  alpha: Array<number>;
  curl: Array<number>;
  totalMass: number;
  maxRho: number;
  minRho: number;
  fluidCellCount: number;
  interfaceCellCount: number;
  // meta
  flag: Array<Flags>;
};

/**
 * Create an empty lattice distributions
 */
export const makeLatticeDistributionsStructure = (
  x: number,
  y: number,
): LatticeDistributions => ({
  C: [...Array(x * y)].fill(0),
  N: [...Array(x * y)].fill(0),
  S: [...Array(x * y)].fill(0),
  E: [...Array(x * y)].fill(0),
  W: [...Array(x * y)].fill(0),
  NE: [...Array(x * y)].fill(0),
  SE: [...Array(x * y)].fill(0),
  NW: [...Array(x * y)].fill(0),
  SW: [...Array(x * y)].fill(0),
});

/**
 * Create an empty lattice
 */
export const makeLatticeStructure = (x: number, y: number): Lattice => ({
  x,
  y,

  distributions: makeLatticeDistributionsStructure(x, y),
  nextDistributions: makeLatticeDistributionsStructure(x, y),

  rho: [...Array(x * y)].fill(0),
  ux: [...Array(x * y)].fill(0),
  uy: [...Array(x * y)].fill(0),
  m: [...Array(x * y)].fill(0),
  alpha: [...Array(x * y)].fill(1),
  curl: [...Array(x * y)].fill(0),
  totalMass: 0,
  maxRho: 0,
  minRho: 0,
  fluidCellCount: 0,
  interfaceCellCount: 0,
  flag: [...Array(x * y)].fill(Flags.barrier),
});

/**
 * Create a lattice filled with fluid at equilibirum
 */
export const makeLatticeAtEquilibrium = (
  x: number,
  y: number,
  rho: number,
  ux: number,
  uy: number,
): Lattice => {
  const lattice = makeLatticeStructure(x, y);
  const equilibriumDistribution = getEquilibriumDistribution(rho, ux, uy);
  forEachCellOfLattice(lattice, i => {
    lattice.distributions.C[i] = equilibriumDistribution.C;
    lattice.distributions.NW[i] = equilibriumDistribution.NW;
    lattice.distributions.N[i] = equilibriumDistribution.N;
    lattice.distributions.NE[i] = equilibriumDistribution.NE;
    lattice.distributions.W[i] = equilibriumDistribution.W;
    lattice.distributions.E[i] = equilibriumDistribution.E;
    lattice.distributions.SW[i] = equilibriumDistribution.SW;
    lattice.distributions.S[i] = equilibriumDistribution.S;
    lattice.distributions.SE[i] = equilibriumDistribution.SE;
    lattice.nextDistributions.C[i] = equilibriumDistribution.C;
    lattice.nextDistributions.NW[i] = equilibriumDistribution.NW;
    lattice.nextDistributions.N[i] = equilibriumDistribution.N;
    lattice.nextDistributions.NE[i] = equilibriumDistribution.NE;
    lattice.nextDistributions.W[i] = equilibriumDistribution.W;
    lattice.nextDistributions.E[i] = equilibriumDistribution.E;
    lattice.nextDistributions.SW[i] = equilibriumDistribution.SW;
    lattice.nextDistributions.S[i] = equilibriumDistribution.S;
    lattice.nextDistributions.SE[i] = equilibriumDistribution.SE;
    lattice.rho[i] = rho;
    lattice.ux[i] = ux;
    lattice.uy[i] = uy;
    lattice.m[i] = rho;
    lattice.alpha[i] = 1;
    lattice.flag[i] = Flags.fluid;
  });
  return lattice;
};

/**
 * get the lattice index of a position (x, y)
 */
export const getIndex = (xLattice: number, x: number, y: number): number =>
  x + y * xLattice;

/**
 * get the position (x, y) from the lattice index
 */
export const getPosition = (
  xLattice: number,
  i: number,
): { x: number; y: number } => {
  const y = Math.floor(i / xLattice);
  const x = i - y * xLattice;
  return { x, y };
};

type ForEachCellOfLatticeOptions = {
  includeBorders?: boolean;
  order?: { x: "asc" | "desc"; y: "asc" | "desc" };
};

/**
 * iterate on each cell of a lattice
 */
export const forEachCellOfLattice = (
  lattice: Lattice,
  fn: (index: number, x: number, y: number, lattice: Lattice) => void,
  {
    includeBorders = false,
    order = { x: "asc", y: "asc" },
  }: ForEachCellOfLatticeOptions = {},
): void => {
  const { x: xLattice, y: yLattice } = lattice;
  const xMin = includeBorders ? 0 : 1;
  const xMax = includeBorders ? xLattice - 1 : xLattice - 2;
  const yMin = includeBorders ? 0 : 1;
  const yMax = includeBorders ? yLattice - 1 : yLattice - 2;
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      const y1 = order.y === "asc" ? y : yMax - y + yMin;
      const x1 = order.x === "asc" ? x : xMax - x + xMin;
      const index = getIndex(xLattice, x1, y1);
      fn(index, x1, y1, lattice);
    }
  }
};

/**
 * LBM Collide step
 */
export const collide = (
  lattice: Lattice,
  viscosity: number,
  gravity: number,
): void => {
  const { distributions } = lattice;
  forEachCellOfLattice(lattice, i => {
    if (
      lattice.flag[i] !== Flags.fluid &&
      lattice.flag[i] !== Flags.interface
    ) {
      return;
    }
    const collided = collideCell(
      distributions.NW[i],
      distributions.N[i],
      distributions.NE[i],
      distributions.W[i],
      distributions.C[i],
      distributions.E[i],
      distributions.SW[i],
      distributions.S[i],
      distributions.SE[i],
      lattice.rho[i],
      lattice.ux[i],
      lattice.uy[i],
      lattice.m[i],
      viscosity,
      gravity,
    );
    distributions.NW[i] = collided.NW;
    distributions.N[i] = collided.N;
    distributions.NE[i] = collided.NE;
    distributions.W[i] = collided.W;
    distributions.C[i] = collided.C;
    distributions.E[i] = collided.E;
    distributions.SW[i] = collided.SW;
    distributions.S[i] = collided.S;
    distributions.SE[i] = collided.SE;

    lattice.uy[i] = calculateUy(
      distributions.NW[i],
      distributions.N[i],
      distributions.NE[i],
      distributions.SW[i],
      distributions.S[i],
      distributions.SE[i],
      lattice.rho[i],
    );
  });
};

/**
 * stream to a cell (x, y) from a direction
 * @param lattice lattice
 * @param x x coor of cell to stream toward
 * @param y y coor of cell to stream toward
 * @param dir direction to stream from
 * @returns stream from the cell in the given given direction
 */
const streamFromDirection = (
  lattice: Lattice,
  x: number,
  y: number,
  gasDistributions: Distributions,
  dir: Direction,
): { distribution: number; deltaMass: number; oppositeDir: Direction } => {
  const { x: dx, y: dy, oppositeDir } = DirectionRecord[dir];
  const iFrom = getIndex(lattice.x, x + dx, y + dy);
  const iTo = getIndex(lattice.x, x, y);
  const flagTo = lattice.flag[iTo];
  // consider sources as fluid
  const flagFrom =
    lattice.flag[iFrom] === Flags.source ? Flags.fluid : lattice.flag[iFrom];
  // barrier > fluid
  if (flagTo === Flags.fluid && flagFrom === Flags.barrier) {
    return {
      distribution: lattice.distributions[dir][iTo],
      deltaMass: 0,
      oppositeDir,
    };
  }
  // (gas > interface) | (barrier > interface)
  if (
    flagTo === Flags.interface &&
    (flagFrom === Flags.gas || flagFrom === Flags.barrier)
  ) {
    return {
      distribution:
        gasDistributions[oppositeDir] +
        gasDistributions[dir] -
        lattice.distributions[dir][iTo],
      deltaMass: 0,
      oppositeDir,
    };
  }

  const distribution = lattice.distributions[oppositeDir][iFrom];
  const deltaMass =
    lattice.distributions[oppositeDir][iFrom] - lattice.distributions[dir][iTo];
  // (fluid > fluid) | (interface > fluid) | (fluid > interface)
  if (
    (flagTo === Flags.fluid && flagFrom === Flags.fluid) ||
    (flagTo === Flags.fluid && flagFrom === Flags.interface) ||
    (flagTo === Flags.interface && flagFrom === Flags.fluid)
  ) {
    return { distribution, deltaMass, oppositeDir };
  }

  // interface > interface
  if (flagTo === Flags.interface && flagFrom === Flags.interface) {
    const ci = (1 / 2) * (lattice.alpha[iTo] + lattice.alpha[iFrom]);
    return { distribution, deltaMass: ci * deltaMass, oppositeDir };
  }
  throw new Error(`Unexpected stream from ${flagFrom} to ${flagTo}`);
};

/**
 * LBM stream step
 */
export const stream = (lattice: Lattice): void => {
  // stream to each cell
  forEachCellOfLattice(lattice, (i, x, y) => {
    const flag = lattice.flag[i];
    // ignore everything but interface or fluid cells
    if ([Flags.fluid, Flags.interface].includes(flag) === false) {
      return;
    }

    const gasDistributions = getEquilibriumDistribution(
      // TODO get gas density from its pressure
      1,
      lattice.ux[i],
      lattice.uy[i],
    );
    let dm = 0;
    Object.values(Direction).forEach(dir => {
      const { distribution, deltaMass, oppositeDir } = streamFromDirection(
        lattice,
        x,
        y,
        gasDistributions,
        dir,
      );
      lattice.nextDistributions[oppositeDir][i] = distribution;
      dm += deltaMass;
    });
    lattice.m[i] += dm;
    const rho = calculateRho(
      lattice.nextDistributions.NW[i],
      lattice.nextDistributions.N[i],
      lattice.nextDistributions.NE[i],
      lattice.nextDistributions.W[i],
      lattice.nextDistributions.C[i],
      lattice.nextDistributions.E[i],
      lattice.nextDistributions.SW[i],
      lattice.nextDistributions.S[i],
      lattice.nextDistributions.SE[i],
    );
    lattice.rho[i] = rho;
    lattice.alpha[i] = lattice.m[i] / rho;
    lattice.ux[i] = calculateUx(
      lattice.nextDistributions.NW[i],
      lattice.nextDistributions.NE[i],
      lattice.nextDistributions.W[i],
      lattice.nextDistributions.E[i],
      lattice.nextDistributions.SW[i],
      lattice.nextDistributions.SE[i],
      rho,
    );
    lattice.uy[i] = calculateUy(
      lattice.nextDistributions.NW[i],
      lattice.nextDistributions.N[i],
      lattice.nextDistributions.NE[i],
      lattice.nextDistributions.SW[i],
      lattice.nextDistributions.S[i],
      lattice.nextDistributions.SE[i],
      rho,
    );
  });
  // swap distributions and nextDistributions
  const nextDistributions = lattice.distributions;
  lattice.distributions = lattice.nextDistributions;
  lattice.nextDistributions = nextDistributions;
};

/**
 * LBM flag evolution step
 */
export const flagEvolution = (lattice: Lattice, beta = 0.001): void => {
  forEachCellOfLattice(lattice, (i, x, y) => {
    if (lattice.flag[i] !== Flags.interface) {
      return;
    }
    if (lattice.alpha[i] > 1 + beta) {
      lattice.flag[i] = Flags.fluid;

      const excessMass = lattice.m[i] - lattice.rho[i];
      const neighboorInterfaceCells: number[] = [];

      lattice.m[i] = lattice.rho[i];
      lattice.alpha[i] = 1;

      Object.values(Direction).forEach(dir => {
        if (dir === Direction.C) {
          return;
        }
        const { x: dx, y: dy } = DirectionRecord[dir];
        const i2 = getIndex(lattice.x, x + dx, y + dy);
        if (lattice.flag[i2] === Flags.interface) {
          neighboorInterfaceCells.push(i2);
        }
        if (lattice.flag[i2] === Flags.gas) {
          neighboorInterfaceCells.push(i2);
          lattice.flag[i2] = Flags.interface;
          lattice.rho[i2] = 1;
          lattice.ux[i2] = lattice.ux[i];
          lattice.uy[i2] = lattice.uy[i];
          lattice.m[i2] = 0;
          lattice.alpha[i2] = 0;

          // TODO average the macro around the new cell
          const avgRho = lattice.rho[i];
          const avgUx = lattice.ux[i];
          const avgUy = lattice.uy[i];
          const distributions = getEquilibriumDistribution(
            avgRho,
            avgUx,
            avgUy,
          );
          Object.values(Direction).forEach(dir => {
            lattice.distributions[dir][i2] = distributions[dir];
          });
        }
      });

      // distribute mass excess to neighboor interface cells
      const neighboorInterfaceCellCount = neighboorInterfaceCells.length;
      if (neighboorInterfaceCellCount > 0) {
        const mPerCell = excessMass / neighboorInterfaceCellCount;
        neighboorInterfaceCells.forEach(i => {
          lattice.m[i] += mPerCell;
          lattice.alpha[i] = lattice.m[i] / lattice.rho[i];
        });
      }
      return;
    }

    if (lattice.alpha[i] < -beta) {
      lattice.flag[i] = Flags.gas;

      const massDebt = lattice.m[i];
      const neighboorInterfaceCells: number[] = [];

      Object.values(Direction).forEach(dir => {
        if (dir === Direction.C) {
          return;
        }
        const { x: dx, y: dy } = DirectionRecord[dir];
        const i2 = getIndex(lattice.x, x + dx, y + dy);
        if (lattice.flag[i2] === Flags.interface) {
          neighboorInterfaceCells.push(i2);
        }
        if (lattice.flag[i2] === Flags.fluid) {
          neighboorInterfaceCells.push(i2);
          lattice.flag[i2] = Flags.interface;
        }
      });

      // distribute mass debt to neighboor interface cells
      const neighboorInterfaceCellCount = neighboorInterfaceCells.length;
      if (neighboorInterfaceCellCount > 0) {
        const mPerCell = massDebt / neighboorInterfaceCellCount;
        neighboorInterfaceCells.forEach(i => {
          lattice.m[i] += mPerCell;
          lattice.alpha[i] = lattice.m[i] / lattice.rho[i];
        });
      }
      return;
    }

    // look for isolated interface cells
    let isIsolatedInGas = true;
    let isIsolatedInFluid = true;
    for (const dir of Object.values(Direction)) {
      if (dir === Direction.C) {
        continue;
      }
      const { x: dx, y: dy } = DirectionRecord[dir];
      const i2 = getIndex(lattice.x, x + dx, y + dy);
      if (
        lattice.flag[i2] === Flags.fluid ||
        lattice.flag[i2] === Flags.interface
      ) {
        isIsolatedInGas = false;
      }
      if (
        lattice.flag[i2] === Flags.gas ||
        lattice.flag[i2] === Flags.interface
      ) {
        isIsolatedInFluid = false;
      }
    }
    if (isIsolatedInGas) {
      lattice.flag[i] = Flags.gas;
      // TODO distribute the excess mass to all interface cells
      // const excessMass = lattice.m[i];
    }
    if (isIsolatedInFluid) {
      lattice.flag[i] = Flags.fluid;
      // TODO distribute the mass debt to all interface cells
      // const massDebt = lattice.rho[i] - lattice.m[i];
      lattice.m[i] = lattice.rho[i];
      lattice.alpha[i] = 1;
    }
  });

  // TODO check that the flag changes did not result in a direct fluid / gas contact
};

/**
 * Optionnaly compute curl to render it
 */
export const computeCurl = (lattice: Lattice): void => {
  const getI = (x: number, y: number) => getIndex(lattice.x, x, y);
  let totalMass = 0;
  let maxRho = 1;
  let minRho = 1;
  forEachCellOfLattice(lattice, (i, x, y) => {
    if (
      lattice.flag[i] === Flags.fluid ||
      lattice.flag[i] === Flags.interface
    ) {
      totalMass += lattice.m[i];
      maxRho = Math.max(maxRho, lattice.rho[i]);
      minRho = Math.min(minRho, lattice.rho[i]);
    }
    lattice.curl[i] =
      lattice.uy[getI(x + 1, y)] -
      lattice.uy[getI(x - 1, y)] -
      lattice.ux[getI(x, y + 1)] +
      lattice.ux[getI(x, y - 1)];
  });
  lattice.totalMass = totalMass;
  lattice.maxRho = maxRho;
  lattice.minRho = minRho;
  lattice.fluidCellCount = lattice.flag.filter(f => f === Flags.fluid).length;
  lattice.interfaceCellCount = lattice.flag.filter(
    f => f === Flags.interface,
  ).length;
};

/**
 * LBM full step
 */
export const step = (
  lattice: Lattice,
  viscosity: number,
  gravity: number,
): void => {
  collide(lattice, viscosity, gravity);
  stream(lattice);
  flagEvolution(lattice);
  // optionnal
  computeCurl(lattice);
};

/**
 * Run the simulation
 */
export const run = (
  lattice: Lattice,
  viscosity: number,
  gravity: number,
): Runner => {
  const runner = new Runner(() => step(lattice, viscosity, gravity), 1000);
  return runner;
};
