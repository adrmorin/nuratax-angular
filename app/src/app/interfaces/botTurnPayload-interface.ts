import { Message } from "../interfaces/activeFile-interface";
import { TaxState } from "./taxState-interface";

export interface BotTurnPayload {
  userText: string;
  history: Message[];
  taxState: TaxState;
  emptyFields: string[];
  sessionId: string;
}
