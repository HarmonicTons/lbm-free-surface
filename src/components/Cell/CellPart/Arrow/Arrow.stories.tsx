import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Arrow } from "./Arrow";

export default {
  component: Arrow,
} as ComponentMeta<typeof Arrow>;

const Template: ComponentStory<typeof Arrow> = args => (
  <div style={{ width: "200px", height: "200px", border: "1px dashed black" }}>
    <Arrow {...args} />
  </div>
);

export const Medium = Template.bind({});
Medium.args = {
  percentWidth: 1,
};
