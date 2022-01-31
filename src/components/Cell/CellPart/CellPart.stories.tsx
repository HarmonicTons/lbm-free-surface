import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CellPart } from "./CellPart";
import { Direction } from "../../../domain/cell";

export default {
  component: CellPart,
} as ComponentMeta<typeof CellPart>;

const Template: ComponentStory<typeof CellPart> = args => (
  <div style={{ width: "300px", height: "300px" }}>
    <CellPart {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  direction: Direction.NW,
  arrowSize: 0.6,
};
