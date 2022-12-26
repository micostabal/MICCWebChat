
import {describe, expect, test, jest, beforeAll, afterAll } from '@jest/globals';
import { IGetConversationInformationPayload } from '../../src/interface/controller';
import Message from '../../src/business/Message';
import MessageService from "../../src/service/MessageService";
import MongoDBClient from "../../src/client/MongoDBClient";
import Conversation from '../../src/business/Conversation';
import User from '../../src/business/User';


describe('Unit tests for the API\'s Message Service', ()=>{
  
  let messageService: MessageService;
  
  beforeAll( async () => {
    messageService = new MessageService();
    await messageService.initClient();
  });

  afterAll( async () => {
    await messageService.closeClient();
  });
  
  test('It should get the conversation\'s information', async () => {
    
    const userId = "user-1234";
    const user = new User(userId, "mock user", "mock desc", "mock@usr.com");
    
    const messageId = "mess-1234";
    const message = new Message(messageId,userId,"random text");
    
    const conversationId = "conv-1234";
    const conversation = new Conversation(conversationId,"mock title","mock subject",[messageId]);
    
    
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
});
