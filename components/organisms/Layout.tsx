import { lightTheme } from "@/styles/themes/lightTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Header } from "./Header";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import { IdProvider } from "@/utils/contexts/IdContext";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <IdProvider>{children}</IdProvider>;
};
