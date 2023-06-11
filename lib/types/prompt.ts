
export type Chat = {
  Role: Role;
  Content: string;
}

export type Role = 'system' | 'assistant' | 'user';