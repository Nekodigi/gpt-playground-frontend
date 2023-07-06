/** @jsxImportSource @emotion/react */

import { fontTypes } from "@/styles/font";
import { SerializedStyles } from "@emotion/react";
import { Stack, Typography, useTheme } from "@mui/material";

type ButtonProps = {
  type: "fill" | "contained";
  buttonType?: string;
  img?: string;
  color?: string;
  href?: string;
  label: string;
  style?: React.CSSProperties;
  labelStyle?: SerializedStyles;
  onClick?: () => void;
};

export const BasicButton = ({
  type,
  buttonType,
  img,
  color,
  href,
  label,
  style,
  labelStyle,
  onClick,
}: ButtonProps) => {
  const theme = useTheme();
  const s = {
    ...{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 48,
      borderRadius: 4,
      textDecoration: "none",
    },
    ...(type === "contained"
      ? {
          border: 2,
          borderStyle: "solid",
          borderColor: theme.palette.com.black,
        }
      : {
          backgroundColor: color,
        }),
    ...style,
  };

  const child = (
    <Stack direction="row" gap={1.5} alignItems="center">
      {img ? <img src={img} width={24} height={24} /> : undefined}
      <Typography
        css={[
          fontTypes(theme).item,
          {
            fontWeight: 700,
            color:
              type === "contained"
                ? theme.palette.com.black
                : theme.palette.com.white,
          },
          labelStyle,
        ]}
      >
        {label}
      </Typography>
    </Stack>
  );

  return href ? (
    <a style={s} href={href} onClick={onClick}>
      {child}
    </a>
  ) : (
    <button type={buttonType as any} style={s} onClick={onClick}>
      {child}
    </button>
  );
};
