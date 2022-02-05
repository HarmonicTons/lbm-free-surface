import produce from "immer";
import React, { memo, Reducer, useCallback, useReducer } from "react";
import { createUseStyles } from "react-jss";
import { Flags } from "../../domain/cell";
import { forEachCellOfLattice, Lattice } from "../../domain/lattice";
import { Cell } from "./Cell/Cell";

type StylesProps = {
  x: number;
  y: number;
  zoom: number;
};
const useStyles = createUseStyles({
  grid: {
    display: "flex",
    width: ({ x, zoom }: StylesProps) => `${x * zoom + 2}px`,
    height: ({ y, zoom }: StylesProps) => `${y * zoom + 2}px`,
    flexWrap: "wrap",
    margin: "auto",
    marginTop: "20px",
    position: "relative",
    border: "1px solid #999",
    boxShadow: "#ddd 5px 5px",
  },
});

export type DOMLatticeProps = {
  initialLattice: Lattice;
  viscosity?: number;
  gravity?: number;
  zoom?: number;
};
type Action = {
  type: string;
  payload: any;
};
const reducer: Reducer<Lattice, Action> = (state, action) => {
  switch (action.type) {
    case "updateCell": {
      const newLattice = produce(state, draft => {
        draft.flag[action.payload.i] = Flags.gas;
      });
      return newLattice;
    }
    default:
      throw new Error();
  }
};

export const DOMLattice = memo(
  ({ initialLattice, zoom = 10 }: DOMLatticeProps): JSX.Element => {
    const [lattice, dispatch] = useReducer(reducer, initialLattice);
    const styles = useStyles({ x: lattice.x, y: lattice.y, zoom });
    const cells: JSX.Element[] = [];

    const handleClickCell = useCallback(
      (i: number) => {
        dispatch({
          type: "updateCell",
          payload: { i },
        });
      },
      [dispatch],
    );

    forEachCellOfLattice(
      lattice,
      i => {
        cells.push(
          <Cell
            key={i}
            zoom={zoom}
            flag={lattice.flag[i]}
            onClick={handleClickCell}
            i={i}
          />,
        );
      },
      { includeBorders: true, order: { x: "asc", y: "desc" } },
    );
    return <div className={styles.grid}>{cells}</div>;
  },
);
DOMLattice.displayName = "DOMLattice";
