import {describe, expect, test, jest, beforeAll, afterAll } from '@jest/globals';
import axios from 'axios';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';
import MessageService from "../../src/service/MessageService";
import WebChatApp from "../../src/controller/WebChatApp";
import WebchatApp from '../../src/controller/WebChatApp';

describe('Chat Controller should behave as expected', () => {
  
  let webChatApp: WebChatApp;

  beforeAll( async () => {
    webChatApp = await WebChatApp.getApp();
  });
  
  afterAll( async () => {
    await webChatApp.closeApp();
  });
  
  test('It should throw error if conversation does not exist', async () => {
    jest.spyOn(MessageService.prototype, 'getConversationInformationHandler').mockImplementation(
      () => {throw new BadRequestError("")} );
    
    const response: Response = await axios.get(
      `http://localhost:${webChatApp.port}/chat/conversation/bad-id`,
      { validateStatus: (status) => status>=400 }
    );
    expect(response.status).toEqual(404);
  
  });
  
  test('It should get a conversation\'s information', () => {});
  
  test('It should post a conversation', () => {});
  test('It should post a message', () => {});

});