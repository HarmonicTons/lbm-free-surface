import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Slider } from "./Slider";

export default {
  component: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = args => (
  <div style={{ width: "200px", height: "200px", border: "1px dashed black" }}>
    <Slider {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  value: 0.5,
  label: "slider",
};
