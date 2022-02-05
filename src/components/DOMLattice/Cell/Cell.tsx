import React, { memo, useCallback } from "react";
import { createUseStyles } from "react-jss";
import { Flags } from "../../../domain/cell";

const flagColors: Record<Flags, string> = {
  [Flags.barrier]: "#111",
  [Flags.fluid]: "#00f",
  [Flags.gas]: "#fff",
  [Flags.interface]: "#00f",
  [Flags.source]: "#00f",
};

type StylesProps = {
  zoom: number;
  flag: Flags;
};
const useStyles = createUseStyles({
  cell: {
    border: "1px solid #999",
    width: ({ zoom }: StylesProps) => `${zoom}px`,
    height: ({ zoom }: StylesProps) => `${zoom}px`,
    cursor: "pointer",
    transition: `
        box-shadow 0.1s linear,
        border-color 0.1s linear,
        z-index 0.3s linear
    `,
    zIndex: "0",
    animation: "lower 0.1s linear",
    padding: "1px",
    position: "relative",

    "&:after": {
      content: '""',
      backgroundColor: ({ flag }: StylesProps) => flagColors[flag],
      position: "absolute",
      width: ({ zoom }: StylesProps) => `${zoom - 4}px`,
      height: ({ zoom }: StylesProps) => `${zoom - 4}px`,
    },

    "&:hover": {
      borderColor: "#111",
      boxShadow: "0 0 0 1px #111",
      zIndex: "100",
      transition: "all 0.1s ease",
    },
  },
  "@keyframes lower": {
    from: { zIndex: "2" },
    to: { zIndex: "0" },
  },
});

export type CellProps = {
  zoom: number;
  flag: Flags;
  onClick: (i: number) => void;
  i: number;
};

export const Cell = memo(
  ({ zoom, flag, onClick, i }: CellProps): JSX.Element => {
    const styles = useStyles({ zoom, flag });
    const handleClick = useCallback(() => onClick(i), [i]);
    return <div className={styles.cell} onClick={handleClick}></div>;
  },
);
Cell.displayName = "Cell";
