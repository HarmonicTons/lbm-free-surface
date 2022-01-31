import React, { useCallback, useState } from "react";
import { createUseStyles } from "react-jss";
import { Direction } from "../../../domain/cell";
import { Arrow } from "./Arrow/Arrow";
import { Dot } from "./Dot/Dot";

type StylesProps = {
  direction: Direction;
};
const useStyles = createUseStyles({
  cellPart: {
    width: "100%",
    height: "100%",
    border: "1px dotted black",
  },
  dotContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  arrowContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingLeft: "15%",
    transform: ({ direction }: StylesProps) => {
      let deg = 0;
      switch (direction) {
        case Direction.NW:
          deg = -135;
          break;
        case Direction.N:
          deg = -90;
          break;
        case Direction.NE:
          deg = -45;
          break;
        case Direction.W:
          deg = -180;
          break;
        case Direction.E:
          deg = 0;
          break;
        case Direction.SW:
          deg = 135;
          break;
        case Direction.S:
          deg = 90;
          break;
        case Direction.SE:
          deg = 45;
          break;
      }
      const shouldTranslate = [
        Direction.NW,
        Direction.NE,
        Direction.SW,
        Direction.SE,
      ].includes(direction);
      return `rotate(${deg}deg)${shouldTranslate ? " translate(-15%, 0)" : ""}`;
    },
  },
});

export type CellPartProps = {
  direction: Direction;
  arrowSize: number;
};

export const CellPart = ({
  direction,
  arrowSize,
}: CellPartProps): JSX.Element => {
  const classes = useStyles({ direction });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  return (
    <div
      className={classes.cellPart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={
          direction === "C" ? classes.dotContainer : classes.arrowContainer
        }
      >
        {direction === "C" && (
          <Dot
            percentWidth={arrowSize / 5}
            color={isHovered ? "red" : "black"}
          />
        )}
        {direction !== "C" && (
          <Arrow percentWidth={arrowSize} color={isHovered ? "red" : "black"} />
        )}
      </div>
    </div>
  );
};
