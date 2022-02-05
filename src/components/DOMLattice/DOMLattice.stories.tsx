import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DOMLattice } from "./DOMLattice";
import { makeLatticeAtEquilibrium } from "../../domain/lattice";

export default {
  component: DOMLattice,
} as ComponentMeta<typeof DOMLattice>;

const Template: ComponentStory<typeof DOMLattice> = args => (
  <DOMLattice {...args} />
);

const lattice1 = makeLatticeAtEquilibrium(10, 10, 1, 0, 0);

export const Lattice1 = Template.bind({});
Lattice1.args = {
  initialLattice: lattice1,
  gravity: 0,
};
