"use client";

import { ChatInput } from "@/components/molecules/chatInput";
import { PromptContext, PromptContextProps } from "@/lib/contexts/prompt";
import { Chat } from "@/lib/types/prompt";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import { Add, Send } from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import { Args } from "@/lib/types/args";
import { ArgsContext, ArgsContextProps } from "@/lib/contexts/args";
import { ArgInput } from "@/components/molecules/argInput";
import axios, { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { useIdContext } from "@/utils/contexts/IdContext";
import Link from "next/link";

export default function Home() {
  const [prompt, setPrompt] = useState<Chat[]>([{ Role: "user", Content: "" }]);
  const [args, setArgs] = useState<Args>({ text: "sample" });
  const prompt_: PromptContextProps = { prompt: prompt, setPrompt: setPrompt };
  const args_: ArgsContextProps = { args: args, setArgs: setArgs };
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [errorUrl, setErrorUrl] = useState<string>("");
  const router = useRouter();
  const searchPrams = useSearchParams();
  const { userId, browserId } = useIdContext();

  const onLoad = useEffect(() => {
    const prompt = searchPrams.get("prompt");
    if (prompt) {
      setPrompt(JSON.parse(prompt));
    }
  }, []);

  const finalPrompt = useMemo(() => {
    let finalPrompt: Chat[] = [];
    prompt.forEach((c) => {
      finalPrompt.push({ ...c });
      Object.keys(args).forEach((k) => {
        finalPrompt[finalPrompt.length - 1].Content = c.Content.replaceAll(
          `{${k}}`,
          args[k]
        );
      });
    });
    return finalPrompt;
  }, [prompt, args]);

  const argsInputs = useMemo(() => {
    let newargs: Args = {};
    prompt.forEach((c) => {
      let reading = false;
      let key = "";
      Array.from(c.Content).forEach((c) => {
        if (c == "{") {
          reading = true;
          key = "";
        } else if (c == "}") {
          reading = false;
          newargs[key] = "";
        } else if (reading) {
          key += c;
        }
      });
    });
    setArgs(newargs);
    return Object.keys(newargs).map((k) => <ArgInput key={k} k={k} />);
  }, [prompt]);

  const chatInputs = useMemo(() => {
    //don't reload website when param update

    // router.replace(`/?prompt=${JSON.stringify(prompt)}`, undefined, {
    //   shallow: true,
    // });
    if (process.browser)
      history.replaceState(null, "", `/?prompt=${JSON.stringify(prompt)}`);
    return prompt.map((c, i) => <ChatInput key={i} index={i} />);
  }, [prompt]);

  const onSend = async () => {
    console.log(JSON.stringify({ prompt: finalPrompt, userId: userId }));
    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/chatgpt`,
        method: "post",
        data: { prompt: finalPrompt, userId: userId },
      });
      setResult(res.data);
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        console.log(e);
        let resp = e.response;
        if (resp.status == 402) {
          setErrorUrl(
            `${process.env.NEXT_PUBLIC_CHARGE_FRONT_URL}/${process.env.NEXT_PUBLIC_SERVICE_ID}?link_target=${browserId}`
          );
          setError("Payment required. Please go to dashboard to top up.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    }
  };

  return (
    <ArgsContext.Provider value={args_}>
      <PromptContext.Provider value={prompt_}>
        <Header />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h3" mb={4}>
            GPT Playground
          </Typography>
          <Typography variant="h4" mb={2}>
            Input
          </Typography>
          <Stack spacing={2} mb={4}>
            {argsInputs}
          </Stack>
          <Button
            sx={{ float: "right" }}
            variant="contained"
            endIcon={<Send />}
            onClick={() => onSend()}
          >
            Send
          </Button>
          <Typography variant="h4" mb={2} mt={8}>
            Result
          </Typography>
          <Typography variant="h5" mb={2}>
            {result}
          </Typography>
          {error ? (
            errorUrl ? (
              <Link href={errorUrl}>
                <Alert severity="error">{error}</Alert>
              </Link>
            ) : (
              <Alert severity="error">{error}</Alert>
            )
          ) : undefined}
          <Typography variant="h3" mb={2} mt={30}>
            Prompt
          </Typography>
          <Stack spacing={2} mb={4}>
            {chatInputs}
            <Box>
              <IconButton
                sx={{ float: "right" }}
                onClick={() => {
                  prompt.push({ Role: "user", Content: "" });
                  setPrompt([...prompt]);
                }}
              >
                <Add />
              </IconButton>
            </Box>
          </Stack>
          <Typography mb={2}>{JSON.stringify(finalPrompt)}</Typography>
        </Container>
      </PromptContext.Provider>
    </ArgsContext.Provider>
  );
}
