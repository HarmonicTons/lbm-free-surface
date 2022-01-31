import { createUseStyles } from "react-jss";

export const useSliderStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  labelAndInput: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputNumber: {
    width: "50%",
  },
});
