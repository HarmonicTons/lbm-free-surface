import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ControllableLattice } from "./ControllableLattice";
import { makeLatticeAtEquilibrium } from "../../domain/lattice";
import { Flags } from "../../domain/cell";

export default {
  component: ControllableLattice,
} as ComponentMeta<typeof ControllableLattice>;

const Template: ComponentStory<typeof ControllableLattice> = args => (
  <ControllableLattice {...args} />
);

const lattice1 = makeLatticeAtEquilibrium(6, 5, 1, 0, 0);
lattice1.distributions.E[14] = 0.25;
lattice1.ux[14] = 0.122;
lattice1.rho[14] = 1.139;
lattice1.m[14] = 1.139;

export const Lattice1 = Template.bind({});
Lattice1.args = {
  lattice: lattice1,
  gravity: 0,
};

const lattice2 = makeLatticeAtEquilibrium(6, 5, 1, 0.1, 0);

export const Lattice2 = Template.bind({});
Lattice2.args = {
  lattice: lattice2,
  gravity: 0,
};

const lattice2bis = makeLatticeAtEquilibrium(6, 5, 1, 0.1, 0);
lattice2bis.flag[7] = Flags.source;
lattice2bis.flag[13] = Flags.source;
lattice2bis.flag[19] = Flags.source;
lattice2bis.flag[10] = Flags.source;
lattice2bis.flag[16] = Flags.source;
lattice2bis.flag[22] = Flags.source;

export const Lattice2bis = Template.bind({});
Lattice2bis.args = {
  lattice: lattice2bis,
  gravity: 0,
};

const lattice3 = makeLatticeAtEquilibrium(6, 5, 1, 0, 0);

export const Lattice3 = Template.bind({});
Lattice3.args = {
  lattice: lattice3,
  gravity: 0.002,
};

const lattice4 = makeLatticeAtEquilibrium(6, 5, 1, 0.1, 0);
lattice4.flag[15] = Flags.barrier;

export const Lattice4 = Template.bind({});
Lattice4.args = {
  lattice: lattice4,
  gravity: 0.002,
};

const damBreak = makeLatticeAtEquilibrium(6, 5, 1, 0, 0);
damBreak.flag[9] = Flags.interface;
damBreak.m[9] = 0.95;
damBreak.alpha[9] = 0.95;
damBreak.flag[15] = Flags.interface;
damBreak.m[15] = 0.5;
damBreak.alpha[15] = 0.5;
damBreak.flag[21] = Flags.interface;
damBreak.m[21] = 0.1;
damBreak.alpha[21] = 0.1;
damBreak.flag[20] = Flags.interface;
damBreak.m[20] = 0.1;
damBreak.alpha[20] = 0.1;
damBreak.flag[19] = Flags.interface;
damBreak.m[19] = 0.1;
damBreak.alpha[19] = 0.1;
damBreak.flag[10] = Flags.gas;
damBreak.flag[16] = Flags.gas;
damBreak.flag[22] = Flags.gas;

export const DamBreak = Template.bind({});
DamBreak.args = {
  lattice: damBreak,
  gravity: 0.002,
};

const lake = makeLatticeAtEquilibrium(6, 5, 1, 0, 0);
lake.flag[13] = Flags.interface;
lake.m[13] = 0.5;
lake.alpha[13] = 0.5;
lake.flag[14] = Flags.interface;
lake.m[14] = 0.5;
lake.alpha[14] = 0.5;
lake.flag[15] = Flags.interface;
lake.m[15] = 0.5;
lake.alpha[15] = 0.5;
lake.flag[16] = Flags.interface;
lake.m[16] = 0.5;
lake.alpha[16] = 0.5;
lake.flag[19] = Flags.gas;
lake.flag[20] = Flags.gas;
lake.flag[21] = Flags.gas;
lake.flag[22] = Flags.gas;

export const Lake = Template.bind({});
Lake.args = {
  lattice: lake,
  gravity: 0.002,
};

const freeFall = makeLatticeAtEquilibrium(7, 8, 1, 0, 0);
freeFall.flag[37] = Flags.interface;
freeFall.m[37] = 0.1;
freeFall.alpha[37] = 0.1;
freeFall.flag[38] = Flags.interface;
freeFall.m[38] = 0.1;
freeFall.alpha[38] = 0.1;
freeFall.flag[39] = Flags.interface;
freeFall.m[39] = 0.1;
freeFall.alpha[39] = 0.1;
freeFall.flag[30] = Flags.interface;
freeFall.m[30] = 0.1;
freeFall.alpha[30] = 0.1;
freeFall.flag[32] = Flags.interface;
freeFall.m[32] = 0.1;
freeFall.alpha[32] = 0.1;
freeFall.flag[23] = Flags.interface;
freeFall.m[23] = 0.1;
freeFall.alpha[23] = 0.1;
freeFall.flag[24] = Flags.interface;
freeFall.m[24] = 0.1;
freeFall.alpha[24] = 0.1;
freeFall.flag[25] = Flags.interface;
freeFall.m[25] = 0.1;
freeFall.alpha[25] = 0.1;
freeFall.flag[43] = Flags.gas;
freeFall.flag[44] = Flags.gas;
freeFall.flag[45] = Flags.gas;
freeFall.flag[46] = Flags.gas;
freeFall.flag[47] = Flags.gas;
freeFall.flag[36] = Flags.gas;
freeFall.flag[40] = Flags.gas;
freeFall.flag[29] = Flags.gas;
freeFall.flag[33] = Flags.gas;
freeFall.flag[22] = Flags.gas;
freeFall.flag[26] = Flags.gas;
freeFall.flag[15] = Flags.gas;
freeFall.flag[16] = Flags.gas;
freeFall.flag[17] = Flags.gas;
freeFall.flag[18] = Flags.gas;
freeFall.flag[19] = Flags.gas;
freeFall.flag[8] = Flags.gas;
freeFall.flag[9] = Flags.gas;
freeFall.flag[10] = Flags.gas;
freeFall.flag[11] = Flags.gas;
freeFall.flag[12] = Flags.gas;

export const FreeFall = Template.bind({});
FreeFall.args = {
  lattice: freeFall,
  gravity: 0.002,
};

const inversed = makeLatticeAtEquilibrium(6, 5, 1, 0, 0);
inversed.flag[19] = Flags.interface;
inversed.flag[20] = Flags.interface;
inversed.flag[21] = Flags.interface;
inversed.flag[22] = Flags.interface;
inversed.flag[7] = Flags.interface;
inversed.m[7] = 0.5;
inversed.alpha[7] = 0.5;
inversed.flag[8] = Flags.interface;
inversed.m[8] = 0.5;
inversed.alpha[8] = 0.5;
inversed.flag[9] = Flags.interface;
inversed.m[9] = 0.5;
inversed.alpha[9] = 0.5;
inversed.flag[10] = Flags.interface;
inversed.m[10] = 0.5;
inversed.alpha[10] = 0.5;

export const Inversed = Template.bind({});
Inversed.args = {
  lattice: inversed,
  gravity: 0.002,
};
