import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Lattice } from "./Lattice";
import { makeLatticeAtEquilibrium } from "../../domain/lattice";

export default {
  component: Lattice,
} as ComponentMeta<typeof Lattice>;

const Template: ComponentStory<typeof Lattice> = args => <Lattice {...args} />;

export const FoorByFoor = Template.bind({});
FoorByFoor.args = {
  lattice: makeLatticeAtEquilibrium(4, 4, 1, 0, 0),
};

export const SixByFoor = Template.bind({});
SixByFoor.args = {
  lattice: makeLatticeAtEquilibrium(6, 4, 1, 0, 0),
};
