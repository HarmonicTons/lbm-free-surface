import { round } from "lodash";
import React, { useLayoutEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";

type StylesProps = {
  size: number;
  maxSize: number;
  color: string;
};
const useStyles = createUseStyles({
  arrow: ({ size, maxSize, color }: StylesProps) => {
    const l = size - Math.ceil(size / 8) * 2;
    const h = Math.ceil(maxSize / 8);
    const a = h * 2;
    const b = h * 1.5;
    return {
      backgroundColor: color,
      width: `${l}px`,
      height: `${h}px`,
      position: "relative",
      marginRight: `${a}px`,
      marginTop: `${b}px`,
      marginBottom: `${b}px`,
      "&:after": {
        content: '""',
        margin: `-${a}px 0 0 0`,
        borderTop: `${a}px solid transparent`,
        borderBottom: `${a}px solid transparent`,
        position: "absolute",
        borderLeft: `${a}px solid ${color}`,
        width: "0",
        height: "0",
        right: `-${a}px`,
        top: "50%",
      },
    };
  },
});

export type ArrowProps = {
  percentWidth: number;
  color?: string;
};

export const Arrow = ({
  percentWidth,
  color = "black",
}: ArrowProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const classes = useStyles({
    size: round(width * Math.min(percentWidth, 1), 3),
    maxSize: width,
    color,
  });

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);
  return (
    <div style={{ width: "100%" }} ref={ref}>
      <div className={classes.arrow}></div>
    </div>
  );
};
