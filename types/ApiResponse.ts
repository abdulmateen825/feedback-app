import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  isacceptingmessage?: boolean;
  messages?: Array<Message>;
}