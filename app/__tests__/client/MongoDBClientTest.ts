import {describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';
import User from '../../src/business/User';
import Conversation from '../../src/business/Conversation';
import Message from '../../src/business/Message';
import MongoDBClient from '../../src/client/MongoDBClient';

function sum(a: number, b: number): Number {
  return a+b;
}

const mockUserId = uuidv4();

const mockUser: User = new User(
  mockUserId,
  "pepito",
  "soy muy feliz",
  "pepito@feliz.com"
);

const mockUserId2 = uuidv4();

const mockUser2: User = new User(
  mockUserId2,
  "juanito",
  "Colecciono tenedores",
  "juanito@tenedores.tenedor"
);

const mockConversationId = uuidv4();

const mockConversation: Conversation = new Conversation(
  mockConversationId,
  "regalo papa",
  "discusión sobre qué le vamos a regalar a mi papá",
  []
);

const mockMessageId = uuidv4();

const mockMessage: Message = new Message(
  mockMessageId,
  mockUserId,
  "Hola, qué hace?"
);

const mockMessageId2 = uuidv4();

const mockMessage2: Message = new Message(
  mockMessageId2,
  mockUserId,
  "You there?"
);



describe('MongoDb Logic should behave as expected', () => {
  
  let client: MongoDBClient;
  const db_name: string = "MICCChatTest"
  
  beforeAll( async () => {
    client = await MongoDBClient.getMongoDBClient(db_name);
  });

  beforeEach( async () => {
    await client.restartDB(db_name);
  });

  afterAll( async() => {
    client.closeDB();
  });
  
  test('should be able to post and get a user', async () => {
    
    await client.postUser(mockUser);
    
    const possibleUser: User|null = await client.getUser(mockUserId);
    
    const insertedUser: User = possibleUser as User;
    
    expect(mockUser.bio).toEqual(insertedUser.bio);
    expect(mockUser.id).toEqual(insertedUser.id);
    expect(mockUser.name).toEqual(insertedUser.name);
    expect(mockUser.email).toEqual(insertedUser.email);
    
  });
  
  test('should be able to post and get a conversation', async () => {
  
    await client.postConversation(mockConversation);

    const possibleConversation: Conversation|null = await client.getConversation(
      mockConversationId
    );
    
    const insertedConversation: Conversation = possibleConversation as Conversation;
    
    expect(mockConversation.id).toEqual(insertedConversation.id);
    expect(mockConversation.title).toEqual(insertedConversation.title);
    expect(mockConversation.subject).toEqual(insertedConversation.subject);
    expect(mockConversation.messageIds).toEqual([]);
  
  });
  
  test('should be able to add and get messages to a conversation', async () => {
    await client.postConversation(mockConversation);
    
    await client.saveMessageAndAddToConversation(mockMessage, mockConversationId);
    await client.saveMessageAndAddToConversation(mockMessage2, mockConversationId);
    
    const possibleConversation: Conversation|null = await client
      .getConversation(mockConversationId);
    
    const updatedConversation: Conversation = possibleConversation as Conversation;
    
    const insertedMessages: Message[] = await client.getMessages(
      mockConversationId
    );
    
    expect(insertedMessages.length).toEqual(2);
    
    expect(mockMessageId).toEqual(insertedMessages[0].id);
    expect(mockMessage.userId).toEqual(insertedMessages[0].userId);
    expect(mockMessage.text).toEqual(insertedMessages[0].text);
  
  });

  test(`should be able to get users from a list of ids`, async () => {
    await client.postUser(mockUser);
    await client.postUser(mockUser2);
    
    const userList: User[] = await client.getUsers([
      mockUserId,
      mockUserId2
    ]);
    
    const insertedUser: User = userList
      .find(usr => usr.id===mockUserId) as User;
    
    const insertedUser2: User = userList
      .find(usr => usr.id===mockUserId2) as User;
    
    expect(insertedUser).not.toBe(undefined);
    expect(insertedUser2).not.toBe(undefined);
    
    expect((insertedUser as User).id).toEqual(mockUserId);
    expect((insertedUser2 as User).id).toEqual(mockUserId2);
    
  });



});