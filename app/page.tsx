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
  TextField,
  Autocomplete,
  Slider,
  Switch,
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
import "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Home() {
  const [title, setTitle] = useState<string>("GPT Playground");
  const [voiceType, setvoiceType] = useState<number>(0);
  const [lang, setLang] = useState<string>("en-US");
  const [speed, setSpeed] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [useVoice, setUseVoice] = useState<boolean>(true);
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

  const voices = window.speechSynthesis.getVoices();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const langList = [
    "af",
    "eu",
    "bg",
    "ca",
    "ar-EG",
    "ar-JO",
    "ar-KW",
    "ar-LB",
    "ar-QA",
    "ar-AE",
    "ar-MA",
    "ar-IQ",
    "ar-DZ",
    "ar-BH",
    "ar-LY",
    "ar-OM",
    "ar-SA",
    "ar-TN",
    "ar-YE",
    "cs",
    "nl-NL",
    "en-AU",
    "en-CA",
    "en-IN",
    "en-NZ",
    "en-ZA",
    "en-GB",
    "en-US",
    "fi",
    "fr-FR",
    "gl",
    "de-DE",
    "el-GR",
    "he",
    "hu",
    "is",
    "it-IT",
    "id",
    "ja",
    "ko",
    "la",
    "zh-CN",
    "zh-TW",
    "zh-HK",
    "ms-MY",
    "no-NO",
    "pl",
    "xx-piglatin",
    "pt-PT",
    "pt-br",
    "ro-RO",
    "ru",
    "sr-SP",
    "sk",
    "es-AR",
    "es-BO",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-DO",
    "es-EC",
    "es-SV",
    "es-GT",
    "es-HN",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PY",
    "es-PE",
    "es-PR",
    "es-ES",
    "es-US",
    "es-UY",
    "es-VE",
    "sv-SE",
    "tr",
    "zu",
  ];

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
      if (!useVoice) return;
      const uttr = new SpeechSynthesisUtterance(res.data);
      console.log(voices);
      uttr.voice = voices[voiceType];
      uttr.rate = speed;
      uttr.pitch = pitch;
      speechSynthesis.cancel();
      speechSynthesis.speak(uttr);
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

  const listen = () => {
    SpeechRecognition.startListening({
      language: "lang",
    });
  };

  useEffect(() => {
    if (!useVoice) return;
    if (transcript) {
      args[Object.keys(args)[0]] = transcript;
      setArgs({ ...args });
    }
  }, [transcript, args]);

  useEffect(() => {
    if (!useVoice) return;
    if (!listening) {
      listen();
      if (transcript) onSend();
    }
  }, [listening, transcript]);

  return (
    <ArgsContext.Provider value={args_}>
      <PromptContext.Provider value={prompt_}>
        <Header />
        <Container maxWidth="md" sx={{ my: 4 }}>
          <Typography variant="h3" mb={4}>
            {title}
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
          <Typography
            onClick={() => {
              navigator.clipboard.writeText(result);
            }}
            variant="h5"
            mb={2}
            sx={{ whiteSpace: "pre-wrap" }}
          >
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

          <Typography variant="h3" mb={2}>
            Settings
          </Typography>
          <TextField
            label="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Typography>Use voice input and output</Typography>
          <Switch
            checked={useVoice}
            onChange={(e) => setUseVoice(e.target.checked)}
          />
          <Autocomplete
            value={voices[voiceType].name}
            onChange={(e, v) => {
              v ? setvoiceType(voices.map((v) => v.name).indexOf(v)) : null;
            }}
            options={voices.map((v) => v.name)}
            renderInput={(params) => (
              <TextField {...params} label="Output Voice" />
            )}
            sx={{ mb: 1 }}
          />
          <Typography id="Speed">Speed</Typography>
          <Slider
            aria-labelledby="Speed"
            value={speed}
            onChange={(e, v) => setSpeed(v as number)}
            min={0.1}
            step={0.1}
            valueLabelDisplay="auto"
            max={2}
          />
          <Typography id="Pitch">Pitch</Typography>
          <Slider
            aria-labelledby="Pitch"
            value={pitch}
            onChange={(e, v) => setPitch(v as number)}
            min={0}
            step={0.1}
            max={2}
            valueLabelDisplay="auto"
            sx={{ mb: 1 }}
          />

          <Autocomplete
            value={lang}
            onChange={(e, v) => {
              setLang(v ? v : lang);
            }}
            options={langList}
            renderInput={(params) => (
              <TextField {...params} label="Input Voice" />
            )}
            sx={{ mb: 1 }}
          />
        </Container>
      </PromptContext.Provider>
    </ArgsContext.Provider>
  );
}
