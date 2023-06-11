import { createContext } from "react"
import { Chat } from "../types/prompt"


export type PromptContextProps = {
  prompt: Chat[]
  setPrompt: (prompt: Chat[]) => void
}

export const PromptContext = createContext<PromptContextProps>({} as PromptContextProps)
