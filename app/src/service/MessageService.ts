import Message from "../business/Message";
import User from "../business/User";
import MongoDBClient from "../client/MongoDBClient";
import Conversation from "../business/Conversation";
import {
  IPostMessageInput,
  IPostMessagePayload,
  IPostConversationInput,
  IConversation,
  IGetConversationInformationPayload
} from "../interface/controller";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import {v4 as uuidv4} from "uuid";

class MessageService {

  dbClient: MongoDBClient;
  
  async initClient() {
    this.dbClient= await MongoDBClient.getMongoDBClient();
  }
  
  async closeClient() {
    await this.dbClient.closeDB();
  }

  static async getService() {
    const messageService: MessageService = new MessageService();
    await messageService.initClient();
    return messageService;
  }
  
  async getConversationInformationHandler(id: string): Promise<IGetConversationInformationPayload> {
    
    if (! (await this.dbClient.conversationExists(id))) {
      throw new BadRequestError("No such Conversation id in db.");
    }

    const conversation: Conversation = await this.dbClient.getConversation(id) as Conversation;
    const messages = await this.dbClient.getMessages(id);
    const users = await this.dbClient.getUsers(messages.map(message => message.userId))

    return {
      conversation,
      users,
      messages
    };
  }

  async saveConversation(conversationInput: IPostConversationInput): Promise<IConversation> {
    
    const {title, subject} = conversationInput;
    
    const newConversation: Conversation = new Conversation(
      uuidv4(),
      title,
      subject,
      []
    );
    
    await this.dbClient.postConversation(newConversation);
    
    return {conversation: newConversation};
  }
  
  async saveNewMessage(postMessageInput: IPostMessageInput): Promise<IPostMessagePayload> {
    const {
      text,
      conversationId,
      userId} = postMessageInput;

    const userExists : Promise<Boolean> = this.dbClient.userExists(userId);
    const conversationExists : Promise<Boolean> = this.dbClient.conversationExists(conversationId);
    
    if (!(await Promise.all([userExists, conversationExists])).reduce( (prev, cur) => cur && prev) ) {
      throw new BadRequestError("No valid parameters");
    }
    
    const newMessage: Message = new Message(
      uuidv4(),
      userId,
      text);
    
    await this.dbClient.saveMessageAndAddToConversation(
      newMessage,
      conversationId);
    
    return {message: newMessage};
  }

}


export default MessageService;