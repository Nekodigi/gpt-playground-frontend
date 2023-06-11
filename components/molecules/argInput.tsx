import { ArgsContext } from "@/lib/contexts/args";
import { PromptContext } from "@/lib/contexts/prompt";
import { Role } from "@/lib/types/prompt";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Stack,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import { useContext, useState } from "react";

type ArgInputProps = {
  k: string;
};

export const ArgInput = ({ k }: ArgInputProps) => {
  const { args, setArgs } = useContext(ArgsContext);
  return (
    <Stack direction={"row"} spacing={1}>
      <TextField
        label={k}
        fullWidth
        value={args[k]}
        onChange={(e) => {
          args[k] = e.target.value;
          setArgs({ ...args });
        }}
      />
      {/* align center */}
    </Stack>
  );
};
