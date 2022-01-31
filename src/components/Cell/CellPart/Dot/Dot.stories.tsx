import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Dot } from "./Dot";

export default {
  component: Dot,
} as ComponentMeta<typeof Dot>;

const Template: ComponentStory<typeof Dot> = args => (
  <div style={{ width: "200px", height: "200px", border: "1px dashed black" }}>
    <Dot {...args} />
  </div>
);

export const Medium = Template.bind({});
Medium.args = {
  percentWidth: 1,
};
