import { TaxState } from "./taxState-interface";

export interface BotChatResponse {
  chat_message?: string;
  fields?: Partial<TaxState>;
  next_question?: any;
  is_complete?: boolean;
  session_id?: string;
}
