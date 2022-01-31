import React, { useCallback, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { getIndex, Lattice as TLattice } from "../../domain/lattice";
import { Cell } from "../Cell/Cell";
import useControlledState from "@quid/react-use-controlled-state";

type StylesProps = {
  columns: number;
  rows: number;
};
const useStyles = createUseStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: ({ columns }: StylesProps) => "1fr ".repeat(columns),
    gridTemplateRows: ({ rows }: StylesProps) => "1fr ".repeat(rows),
    width: ({ columns }: StylesProps) => `${100 * columns}px`,
    height: ({ rows }: StylesProps) => `${100 * rows}px`,
    border: "1px solid black",
  },
});

export type LatticeProps = {
  lattice: TLattice;
  selectedCell?: number;
  onChangeSelectedCell?: (i: number) => void;
};

export const Lattice = ({
  lattice,
  selectedCell: parentSelectedCell,
  onChangeSelectedCell,
}: LatticeProps): JSX.Element => {
  const rows = lattice.y;
  const columns = lattice.x;
  const classes = useStyles({ columns, rows });
  const { distributions, flag, ux, uy, rho, alpha } = lattice;
  const [selectedCell, setSelectedCell] = useControlledState(
    undefined,
    parentSelectedCell,
    onChangeSelectedCell,
  );
  const handleClick = useCallback((i: number) => () => setSelectedCell(i), [
    setSelectedCell,
  ]);

  const cellsIndexes = useMemo(() => {
    const cellsIndexes = [];
    for (let y = lattice.y - 1; y >= 0; y--) {
      for (let x = 0; x <= lattice.x - 1; x++) {
        cellsIndexes.push(getIndex(lattice.x, x, y));
      }
    }
    return cellsIndexes;
  }, [lattice]);

  return (
    <div className={classes.grid}>
      {cellsIndexes.map(i => (
        <Cell
          key={i}
          flag={flag[i]}
          ux={ux[i]}
          uy={uy[i]}
          rho={rho[i]}
          alpha={alpha[i]}
          distributions={{
            C: distributions.C[i],
            NW: distributions.NW[i],
            N: distributions.N[i],
            NE: distributions.NE[i],
            W: distributions.W[i],
            E: distributions.E[i],
            SW: distributions.SW[i],
            S: distributions.S[i],
            SE: distributions.SE[i],
          }}
          isSelected={selectedCell === i}
          onClick={handleClick(i)}
        />
      ))}
    </div>
  );
};
