import { blue, grey, indigo } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { themeCommon } from "./theme";

let black = "#212121";
let gray = "#757575";

const lightTheme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Noto Sans JP"].join(","),
  },
  palette: {
    mode: "light",
    com: themeCommon,
    primary: indigo,
    secondary: blue,
    local: {
      bg: "#EEEEEE",
      modal: "F5F5F5",
      paper: "#FFFFFF",
      white: "#FFFFFF",
      black: black,
      gray: gray,
      nekodigi: "linear-gradient(117.75deg, #CC208E 16.15%, #6713D2 87.96%);",
      whiteDark: "#D1D1D1",
    },
    text: {
      primary: black,
      secondary: gray,
    },
  },
});
export { lightTheme };
