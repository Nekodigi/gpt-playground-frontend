import { createContext } from "react";
import { Theme } from "@mui/material";

type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext({} as ThemeContextProps);
