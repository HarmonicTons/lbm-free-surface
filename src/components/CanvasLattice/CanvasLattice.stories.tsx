import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CanvasLattice } from "./CanvasLattice";
import {
  getIndex,
  Lattice,
  makeLatticeAtEquilibrium,
  setResistance,
} from "../../domain/lattice";
import {
  Direction,
  Flags,
  getEquilibriumDistribution,
} from "../../domain/cell";
import { PlotTypes } from "./render/render";
import damJson from "./__testData__/dam.json";
import { cloneDeep } from "lodash";

export default {
  component: CanvasLattice,
} as ComponentMeta<typeof CanvasLattice>;

const Template: ComponentStory<typeof CanvasLattice> = args => (
  <CanvasLattice {...args} />
);

/**
 * BUMP
 */
const bump = makeLatticeAtEquilibrium(80, 32, 1, 0.1, 0);
const barrierSize = 8;
for (let y = bump.y / 2 - barrierSize; y <= bump.y / 2 + barrierSize; y++) {
  const x = 20;
  setResistance(bump, 1, x + y * bump.x);
}

export const Bump = Template.bind({});
Bump.args = {
  lattice: bump,
  gravity: 0,
  plotType: PlotTypes.rho,
};

/**
 * CIRCULATING
 */
const circulating = makeLatticeAtEquilibrium(80, 32, 1, 0.1, 0);
for (let y = 10; y <= 22; y++) {
  const x = 20;
  circulating.flag[x + y * bump.x] = Flags.source;
}

export const Circulating = Template.bind({});
Circulating.args = {
  lattice: circulating,
  gravity: 0,
  plotType: PlotTypes.rho,
};

/**
 * FLOW
 */
const flow = makeLatticeAtEquilibrium(80, 32, 1, 0.1, 0);
const barrierSizeBis = 8;
for (
  let y = flow.y / 2 - barrierSizeBis;
  y <= flow.y / 2 + barrierSizeBis;
  y++
) {
  const x = 20;
  setResistance(flow, 1, x + y * flow.x);
}

for (let y = 1; y < flow.y - 1; y++) {
  flow.flag[1 + y * flow.x] = Flags.source;
  flow.flag[flow.x - 2 + y * flow.x] = Flags.source;
}

export const Flow = Template.bind({});
Flow.args = {
  lattice: flow,
  gravity: 0,
  viscosity: 0.02,
  plotType: PlotTypes.rho,
};

/**
 * HALF FLOW
 */
const halfFlow = makeLatticeAtEquilibrium(80, 32, 1, 0.1, 0);
for (let x = 1; x < halfFlow.x - 1; x++) {
  const y = 16;
  halfFlow.flag[x + y * halfFlow.x] = Flags.interface;
}
for (let x = 1; x < halfFlow.x - 1; x++) {
  for (let y = 17; y < halfFlow.y - 1; y++) {
    halfFlow.flag[x + y * halfFlow.x] = Flags.gas;
  }
}

for (let y = 8; y <= 16; y++) {
  const x = 20;
  setResistance(halfFlow, 1, x + y * halfFlow.x);
}

for (let y = 1; y < 16; y++) {
  halfFlow.flag[1 + y * halfFlow.x] = Flags.source;
  halfFlow.flag[halfFlow.x - 2 + y * halfFlow.x] = Flags.source;
}

export const HalfFlow = Template.bind({});
HalfFlow.args = {
  lattice: halfFlow,
  gravity: 0.001,
  viscosity: 0.02,
  plotType: PlotTypes.rho,
};

/**
 * DAM
 */
const dam = makeLatticeAtEquilibrium(80, 45, 1, 0, 0);

for (let y = 16; y < 44; y++) {
  for (let x = 1; x <= 31; x++) {
    dam.flag[getIndex(dam.x, x, y)] = Flags.gas;
  }
}

for (let y = 1; y < 44; y++) {
  for (let x = 31; x < 79; x++) {
    dam.flag[getIndex(dam.x, x, y)] = Flags.gas;
  }
}

for (let x = 1; x < 31; x++) {
  dam.flag[getIndex(dam.x, x, 15)] = Flags.interface;
}

for (let y = 1; y < 16; y++) {
  dam.flag[getIndex(dam.x, 31, y)] = Flags.barrier;
}

export const Dam = Template.bind({});
Dam.args = {
  lattice: dam,
  gravity: 0.001,
  plotType: PlotTypes.ocean,
};

/**
 * DAM BREAK
 */
const damBreak = cloneDeep(damJson) as Lattice;
for (let y = 1; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 30, y)] = Flags.interface;
}
for (let y = 1; y < 16; y++) {
  damBreak.flag[getIndex(damBreak.x, 31, y)] = Flags.gas;
}
export const DamBreak = Template.bind({});
DamBreak.args = {
  lattice: damBreak,
  gravity: 0.001,
  viscosity: 0.01,
  plotType: PlotTypes.ocean,
};

/**
 * COMMUNICATING VESSELS
 */
const communicatingVessels = cloneDeep(damJson) as Lattice;
for (let y = 1; y < 5; y++) {
  communicatingVessels.flag[getIndex(communicatingVessels.x, 30, y)] =
    Flags.interface;
}
for (let y = 1; y < 4; y++) {
  communicatingVessels.flag[getIndex(communicatingVessels.x, 31, y)] =
    Flags.gas;
}
for (let y = 1; y < 16; y++) {
  communicatingVessels.flag[getIndex(communicatingVessels.x, 50, y)] =
    Flags.barrier;
}
export const CommunicatingVessels = Template.bind({});
CommunicatingVessels.args = {
  lattice: communicatingVessels,
  gravity: 0.001,
  plotType: PlotTypes.ocean,
  viscosity: 0.005,
};

/**
 * DAM BREAK
 */
const damBreak2 = cloneDeep(damJson) as Lattice;
for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 30, y)] = Flags.interface;
}
for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 31, y)] = Flags.gas;
}
for (let y = 1; y < 16; y++) {
  damBreak2.flag[getIndex(damBreak2.x, 40, y)] = Flags.barrier;
}
export const DamBreak2 = Template.bind({});
DamBreak2.args = {
  lattice: damBreak2,
  gravity: 0.001,
  plotType: PlotTypes.ocean,
  viscosity: 0.005,
};

/**
 * DAM OVERFLOW
 */
const damOverflow = cloneDeep(damJson) as Lattice;
for (let y = 9; y < 16; y++) {
  damOverflow.flag[getIndex(damOverflow.x, 30, y)] = Flags.interface;
}
for (let y = 10; y < 16; y++) {
  damOverflow.flag[getIndex(damOverflow.x, 31, y)] = Flags.gas;
}
export const DamOverflow = Template.bind({});
DamOverflow.args = {
  lattice: damOverflow,
  gravity: 0.001,
  plotType: PlotTypes.ocean,
  viscosity: 0.005,
};

/**
 * SOURCE
 */
const source = cloneDeep(damJson) as Lattice;
const sd = getEquilibriumDistribution(1, 0.1, 0.1);
for (let y = 1; y < 12; y++) {
  const i = getIndex(source.x, 1, y);
  source.flag[i] = Flags.source;
  Object.values(Direction).forEach(dir => {
    source.distributions[dir][i] = sd[dir];
    source.nextDistributions[dir][i] = sd[dir];
  });
}
for (let y = 33; y < 44; y++) {
  const i = getIndex(source.x, source.x - 2, y);
  source.flag[i] = Flags.source;
  Object.values(Direction).forEach(dir => {
    source.distributions[dir][i] = sd[dir];
    source.nextDistributions[dir][i] = sd[dir];
  });
}
export const Source = Template.bind({});
Source.args = {
  lattice: source,
  gravity: 0.001,
  plotType: PlotTypes.curl,
  viscosity: 0.005,
};

/**
 * DROPLET
 */
const droplet = makeLatticeAtEquilibrium(33, 60, 1, 0, 0);
for (let y = 16; y < 59; y++) {
  for (let x = 1; x < 32; x++) {
    droplet.flag[getIndex(droplet.x, x, y)] = Flags.gas;
  }
}
for (let x = 1; x < 32; x++) {
  droplet.flag[getIndex(droplet.x, x, 15)] = Flags.interface;
}
const h = 40;
const l = 16;
const a = 2;
for (let y = h - a; y <= h + a; y++) {
  for (let x = l - a; x <= l + a; x++) {
    droplet.flag[getIndex(droplet.x, x, y)] = Flags.fluid;
  }
}
for (let y = h - a; y <= h + a; y++) {
  droplet.flag[getIndex(droplet.x, l - a, y)] = Flags.interface;
  droplet.flag[getIndex(droplet.x, l + a, y)] = Flags.interface;
}
for (let x = l - a; x <= l + a; x++) {
  droplet.flag[getIndex(droplet.x, x, h - a)] = Flags.interface;
  droplet.flag[getIndex(droplet.x, x, h + a)] = Flags.interface;
}

export const Droplet = Template.bind({});
Droplet.args = {
  lattice: droplet,
  gravity: 0.001,
  viscosity: 0.02,
  plotType: PlotTypes.ocean,
  width: 330,
  height: 600,
};
