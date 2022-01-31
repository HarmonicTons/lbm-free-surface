import React, { useCallback, useMemo } from "react";
import { useSliderStyles } from "./Slider.styles";

export type SliderProps = {
  value: number;
  label: string;
  onChange?: (value: number) => void;
};

export const Slider = ({
  value,
  label,
  onChange,
}: SliderProps): JSX.Element => {
  const classNames = useSliderStyles();
  const id = useMemo(() => `input-${label}`, [label]);
  const handleChangeSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value) / 100);
    },
    [],
  );
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    },
    [],
  );
  return (
    <div className={classNames.container}>
      <div className={classNames.labelAndInput}>
        <label htmlFor={id}>{label}</label>
        <input
          className={classNames.inputNumber}
          type="number"
          min={0}
          max={1}
          id={id}
          value={value}
          onChange={handleChangeInput}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value * 100}
        onChange={handleChangeSlider}
      />
    </div>
  );
};
