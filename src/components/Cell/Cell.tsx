import React, { useCallback, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { Direction, Distributions, Flags } from "../../domain/cell";
import { Arrow } from "./CellPart/Arrow/Arrow";
import { CellPart } from "./CellPart/CellPart";

const getU = (ux: number, uy: number) => Math.sqrt(ux ** 2 + uy ** 2);

type CellStylesProps = {
  u: number;
  ux: number;
  uy: number;
  alpha: number;
  rho: number;
  isSelected: boolean;
  flag: Flags;
};
const useStyles = createUseStyles({
  cell: {
    overflow: "hidden",
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    width: "100%",
    height: "100%",
    border: ({ isSelected }: CellStylesProps) =>
      `${isSelected ? 3 : 1}px solid black`,
    "& *": {
      boxSizing: "border-box",
    },
    background: ({ flag }: CellStylesProps) =>
      flag === Flags.barrier
        ? `repeating-linear-gradient(
      45deg,
      black,
      black 5%,
      white 5%,
      white 17%
    )`
        : "",
  },
  speed: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingLeft: "50%",
    transform: ({ ux, uy }: CellStylesProps) => {
      const a = -Math.sign(uy) * Math.acos(ux / getU(ux, uy));
      return `rotate(${a}rad)`;
    },
    opacity: ({ u }: CellStylesProps) => {
      if (u < 0.01) {
        return 0;
      }
      if (u < 0.05) {
        return 0.4;
      }
      return 0.7;
    },
  },
  "@keyframes anim": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  fluid: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    marginTop: ({ alpha }: CellStylesProps) =>
      `${100 - Math.round(alpha * 100)}%`,
    display: "flex",
    opacity: ({ rho }) => (5 / 2) * rho - 1.75,
    background: ({ flag }: CellStylesProps) => {
      const color = "rgb(68, 80, 170)";
      return flag === Flags.interface
        ? `repeating-linear-gradient(
      135deg,
      ${color},
      ${color} 10%,
      white 10%,
      white 15%
    )`
        : color;
    },
    zIndex: -1,
    "&:before": {
      content: '""',
      width: "400%",
      height: "400%",
      backgroundColor: "white",
      position: "absolute",
      top: "-400%",
      left: "-150%",
      borderRadius: "45%",
      animation: "$anim 12s linear infinite",
      display: ({ flag }: CellStylesProps) =>
        flag !== Flags.interface ? "none" : null,
    },
  },
});

export type CellProps = {
  flag?: Flags;
  ux: number;
  uy: number;
  alpha: number;
  rho: number;
  distributions: Distributions;
  scaleArrow?: number;
  onMouseEnter?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
};

export const Cell = ({
  flag = Flags.fluid,
  ux,
  uy,
  alpha,
  rho,
  distributions,
  scaleArrow = 5,
  onMouseEnter,
  onClick,
  isSelected = false,
}: CellProps): JSX.Element => {
  const u = useMemo(() => getU(ux, uy), [ux, uy]);
  const classNames = useStyles({ u, ux, uy, isSelected, flag, alpha, rho });
  const getArrowSize = useCallback((d: number) => d * scaleArrow, [scaleArrow]);
  return (
    <div
      className={classNames.cell}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {[Flags.fluid, Flags.interface, Flags.source].includes(flag) && (
        <>
          <div className={classNames.fluid}></div>
          <CellPart
            direction={Direction.NW}
            arrowSize={getArrowSize(distributions.NW)}
          />
          <CellPart
            direction={Direction.N}
            arrowSize={getArrowSize(distributions.N)}
          />
          <CellPart
            direction={Direction.NE}
            arrowSize={getArrowSize(distributions.NE)}
          />
          <CellPart
            direction={Direction.W}
            arrowSize={getArrowSize(distributions.W)}
          />
          <CellPart
            direction={Direction.C}
            arrowSize={getArrowSize(distributions.C)}
          />
          <CellPart
            direction={Direction.E}
            arrowSize={getArrowSize(distributions.E)}
          />
          <CellPart
            direction={Direction.SW}
            arrowSize={getArrowSize(distributions.SW)}
          />
          <CellPart
            direction={Direction.S}
            arrowSize={getArrowSize(distributions.S)}
          />
          <CellPart
            direction={Direction.SE}
            arrowSize={getArrowSize(distributions.SE)}
          />
          <div className={classNames.speed}>
            <Arrow
              percentWidth={u / 0.1}
              color={
                flag === Flags.source ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)"
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
