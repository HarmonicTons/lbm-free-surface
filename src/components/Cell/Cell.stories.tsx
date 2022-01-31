import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Cell } from "./Cell";
import { Flags } from "../../domain/cell";

export default {
  component: Cell,
} as ComponentMeta<typeof Cell>;

const Template: ComponentStory<typeof Cell> = args => (
  <div style={{ width: "300px", height: "300px" }}>
    <Cell {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  ux: 0.056,
  uy: 0.049,
  alpha: 1,
  rho: 1,
  distributions: {
    NW: 0.027,
    N: 0.127,
    NE: 0.038,
    W: 0.093,
    C: 0.441,
    E: 0.13,
    SW: 0.02,
    S: 0.095,
    SE: 0.028,
  },
};
export const NoSpeed = Template.bind({});
NoSpeed.args = {
  ux: 0,
  uy: 0,
  alpha: 1,
  rho: 1,
  distributions: {
    NW: 0.028,
    N: 0.111,
    NE: 0.028,
    W: 0.111,
    C: 0.444,
    E: 0.111,
    SW: 0.028,
    S: 0.111,
    SE: 0.028,
  },
};

export const InterfaceCell = Template.bind({});
InterfaceCell.args = {
  ux: 0,
  uy: 0,
  alpha: 0.4,
  rho: 1,
  flag: Flags.interface,
  distributions: {
    NW: 0.028,
    N: 0.111,
    NE: 0.028,
    W: 0.111,
    C: 0.444,
    E: 0.111,
    SW: 0.028,
    S: 0.111,
    SE: 0.028,
  },
};

export const Barrier = Template.bind({});
Barrier.args = {
  flag: Flags.barrier,
  ux: 0,
  uy: 0,
  distributions: {
    NW: 0,
    N: 0,
    NE: 0,
    W: 0,
    C: 0,
    E: 0,
    SW: 0,
    S: 0,
    SE: 0,
  },
};
