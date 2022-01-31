import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ControllableCell } from "./ControllableCell";

export default {
  component: ControllableCell,
} as ComponentMeta<typeof ControllableCell>;

const Template: ComponentStory<typeof ControllableCell> = () => (
  <ControllableCell />
);

export const Default = Template.bind({});
Default.args = {};
