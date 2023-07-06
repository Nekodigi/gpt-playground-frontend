/** @jsxImportSource @emotion/react */

import { fontTypes } from "@/styles/font";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { BasicButton } from "../atoms/BasicButton";
import { useAuthContext } from "@/utils/contexts/IdContext";
import { useEffect, useMemo, useState } from "react";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { auth } from "@/lib/firebase/firebase";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { UserAvatarMenu } from "./UserAvatarMenu";
import axios from "axios";
import { lightTheme } from "@/styles/themes/lightTheme";

export const Header = () => {
  const { userId } = useAuthContext();
  //const theme = useTheme();
  const theme = lightTheme;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceName, setServiceName] = useState("");

  const fontT = fontTypes(theme); //WHY THIS WORKS?

  // useEffect(() => {
  //   const update = async () => {
  //     let res = await axios({
  //       url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/service/${service_id}`,
  //       method: "get",
  //       data: {},
  //     });
  //     setServiceName(res.data.name);
  //   };
  //   update();
  // }, [service_id]);

  return (
    <AppBar
      position="static"
      sx={{
        background: "white",
        borderBottom: 1,
        borderColor: theme.palette.com.gray500Op50,
      }}
      elevation={0}
    >
      <Container maxWidth="md" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Toolbar>
          {theme ? (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography css={fontT.title}>GPT Playground</Typography>
              <BasicButton
                type="contained"
                href={`${process.env.NEXT_PUBLIC_CHARGE_FRONT_URL}/${process.env.NEXT_PUBLIC_SERVICE_ID}`}
                label="Dashboard"
                style={{
                  padding: 12,
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 27,
                }}
                labelStyle={fontT.body}
              />

              {/* <Avatar {...stringAvatar("Kent Dodds")} /> */}
            </Stack>
          ) : undefined}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
