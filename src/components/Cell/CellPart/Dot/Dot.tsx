import React from "react";
import { createUseStyles } from "react-jss";

type StylesProps = {
  width: number;
  color: string;
};
const useStyles = createUseStyles({
  dot: ({ width, color }: StylesProps) => {
    return {
      backgroundColor: color,
      width: `${width}%`,
      height: `${width}%`,
      borderRadius: "50%",
    };
  },
});

export type DotProps = {
  percentWidth: number;
  color?: string;
};

export const Dot = ({
  percentWidth,
  color = "black",
}: DotProps): JSX.Element => {
  const classes = useStyles({ width: Math.min(percentWidth, 1) * 100, color });

  return <div className={classes.dot}></div>;
};
