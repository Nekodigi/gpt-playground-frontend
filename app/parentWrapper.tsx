"use client";
import { Layout } from "@/components/organisms/Layout";
import { lightTheme } from "@/styles/themes/lightTheme";
import { Theme, ThemeProvider } from "@mui/material";
import React, { useState } from "react";

export default function ParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
}
