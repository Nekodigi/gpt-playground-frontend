import { createContext } from "react";
import { Args } from "../types/args";

export type ArgsContextProps = {
  args: Args;
  setArgs: (args: Args) => void;
};

export const ArgsContext = createContext<ArgsContextProps>(
  {} as ArgsContextProps
);
