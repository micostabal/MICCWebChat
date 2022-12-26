import Message from "../business/Message";
import Conversation from "../business/Conversation";
import User from "../business/User";

export interface IPostMessageInput {
  text: string;
  conversationId: string;
  userId: string;
}

export interface IPostMessagePayload {
  message: Message;
}

export interface IPostConversationInput {
  title: string;
  subject: string;
}

export interface IConversation {
  conversation: Conversation
}

export interface IGetConversationInformationPayload extends IConversation {
  messages: Message[];
  users: User[];
}