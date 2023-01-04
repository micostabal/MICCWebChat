import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import {
  IPostMessageInput,
  IPostConversationInput,
  IConversation,
  IGetConversationInformationPayload,
  IPostMessagePayload
} from "../interface/controller";
import MessageService from "../service/MessageService";

class WebChatApp {
  app: Application;
  server: Server;
  messageService: MessageService;
  port: number = 3000;
  pathPrefix: string = '/chat/conversation';
  
  constructor() {
    this.app = express();

  }

  async run() {
    await this.initApp();
    
    this.server = this.app.listen(this.port, (): void => {
        console.log('MICCWebChatApp Server running on port:', this.port);
    });
  }
  
  async closeApp(): Promise<void> {
    await this.messageService.closeClient();
    this.server.closeAllConnections();
  }
  
  async saveConversation(req: Request, res: Response): Promise<void> {
    const postConversationInput: IPostConversationInput =
     req.body as IPostConversationInput;
    try {
      const conversation : IConversation = await this.messageService.saveConversation(
        postConversationInput
      );
      res.json(conversation);
    } catch {
      res.status(400);
      res.send(`No correct inputs were provided`);
    }
  }

  async saveNewMessage(req: Request, res: Response): Promise<void> {
    const postMessageInput: IPostMessageInput =
     req.body as IPostMessageInput;
    res.json(
      await this.messageService.saveNewMessage(
        postMessageInput
      )
    );
  }
  
  static async getApp(): Promise<WebChatApp> {
    const app: WebChatApp = new WebChatApp();
    await app.run();
    return app;
  }
  
  async initApp(): Promise<void> {
    this.messageService = await MessageService.getService();
    
    this.app.get(
      `${this.pathPrefix}/:id`,
      async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        try {
          const payload: IGetConversationInformationPayload = await this.messageService
            .getConversationInformationHandler(id);
          res.json(payload);
        } catch {
          res.status(404);
          res.send(`Conversation of id: ${id} is not present in Chat`);
        }
      }
    );
    
    this.app.post(
      `${this.pathPrefix}/`,
      this.saveConversation
    );
    
    this.app.post(
      `${this.pathPrefix}/message`,
      this.saveNewMessage
    );
  }
}

export default WebChatApp;