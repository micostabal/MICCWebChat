
import {describe, expect, test, jest, beforeAll, afterAll } from '@jest/globals';
import {
  IGetConversationInformationPayload,
  IPostConversationInput,
  IConversation,
  IPostMessageInput,
  IPostMessagePayload
} from '../../src/interface/controller';
import Message from '../../src/business/Message';
import MessageService from "../../src/service/MessageService";
import MongoDBClient from "../../src/client/MongoDBClient";
import Conversation from '../../src/business/Conversation';
import User from '../../src/business/User';


describe('Unit tests for the API\'s Message Service', ()=>{
  
  let messageService: MessageService;

  const userId = "user-1234";
  const user = new User(userId, "mock user", "mock desc", "mock@usr.com");
  
  const messageId = "mess-1234";
  const message = new Message(messageId,userId,"random text");
  
  const conversationId = "conv-1234";
  const conversation = new Conversation(conversationId,"mock title","mock subject",[messageId]);

  const conversationInput: IPostConversationInput = {
    title: "mock title",
    subject: "mock subject"
  };
  
  const mockText=" MooOck text";
  
  beforeAll( async () => {
    messageService = await MessageService.getService();
  });
  
  afterAll( async () => {
    await messageService.closeClient();
  });
  
  test('It should get the conversation\'s information', async () => {
    
    jest.spyOn(MongoDBClient.prototype, 'getConversation').mockImplementation(
      async (conversationId: string) => conversation);
    jest.spyOn(MongoDBClient.prototype, 'getMessages').mockImplementation(
      async (conversationId: string) => [message]);
    jest.spyOn(MongoDBClient.prototype, 'getUsers').mockImplementation(
      async ([userId]: string[]) => [user]);
    
    const response : IGetConversationInformationPayload =
       await messageService.getConversationInformationHandler(conversationId);
    
    expect(response.conversation).toBe(conversation);
    expect(response.messages[0]).toBe(message);
    expect(response.users[0]).toBe(user);
    
  });
  
  test('should be able to save a conversation', async () => {
    jest.spyOn(MongoDBClient.prototype, 'postConversation').mockImplementation(
      async (conversation : Conversation) => {});
    
    const {conversation: savedConv}: IConversation = await messageService.saveConversation(
      conversationInput);
    
    expect(savedConv.title).toEqual(conversationInput.title);
    expect(savedConv.subject).toEqual(conversationInput.subject);

  });

  test('it should be able to save new messages', async () => {
    jest.spyOn(MongoDBClient.prototype, 'userExists').mockImplementation(
      async (userId : string) => {return true});
    jest.spyOn(MongoDBClient.prototype, 'conversationExists').mockImplementation(
      async (convId : string) => {return true});
    jest.spyOn(MongoDBClient.prototype, 'saveMessageAndAddToConversation').mockImplementation(
      async (message: Message, conversationId : string) => {});
    
    const postMessageInput: IPostMessageInput = {
      text: mockText,
      conversationId,
      userId
    };
    
    const {message: insertedMessage}: IPostMessagePayload = await messageService.saveNewMessage(postMessageInput);
    
    expect(insertedMessage.text).toEqual(mockText);
    expect(insertedMessage.userId).toEqual(userId);
  });


});
