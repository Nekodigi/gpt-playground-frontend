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

type ChatInputProps = {
  index: number;
};

export const ChatInput = ({ index }: ChatInputProps) => {
  const { prompt, setPrompt } = useContext(PromptContext);
  return (
    <Stack direction={"row"} spacing={1}>
      <FormControl sx={{ width: "150px" }}>
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          value={prompt[index].Role}
          label="Role"
          onChange={(e) => {
            prompt[index].Role = e.target.value as Role;
            setPrompt([...prompt]);
          }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="assistant">Assistant</MenuItem>
          <MenuItem value="system">system</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        value={prompt[index].Content}
        onChange={(e) => {
          prompt[index].Content = e.target.value;
          setPrompt([...prompt]);
        }}
      />
      {/* align center */}
      <Box display="flex" alignItems="center">
        <IconButton
          sx={{ mt: "auto", mb: "auto" }}
          onClick={() => setPrompt(prompt.filter((c, i) => i != index))}
        >
          <Delete />
        </IconButton>
      </Box>
    </Stack>
  );
};
