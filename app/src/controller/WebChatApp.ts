import express, { Application, Request, Response } from 'express';
import {
  IPostMessageInput,
  IPostConversationInput,
  IConversation,
  IGetConversationInformationPayload,
  IPostMessagePayload
} from "../interface/controller";
import MessageService from "../service/MessageService";

class WebchatApp {
  app: Application;
  port: number = 3000;
  pathPrefix: string = '/chat/conversation';

  constructor() {
    this.app = express();
  }

  async run() {
    await this.initApp();
    
    this.app.listen(this.port, (): void => {
        console.log('MICCWebChatApp Server running on port:', this.port);
    });
  }
  
  async initApp(): Promise<void> {
    const messageService = await MessageService.getService();
    
    this.app.get(
      `${this.pathPrefix}/:id`,
      async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        res.json(await messageService.getConversationInformationHandler(id));
      }
    );
    
    this.app.get(
      `/hello/world`,
      async (req: Request, res: Response): Promise<void> => {
        res.json({hello: "World"});
      }
    );

    this.app.post(
      `${this.pathPrefix}/`,
      async (req: Request, res: Response): Promise<void> => {
        const postConversationInput: IPostConversationInput =
         req.body as IPostConversationInput;
        res.json(
          await messageService.saveConversation(
            postConversationInput
          )
        );
      }
    )

    this.app.post(
      `${this.pathPrefix}/message`,
      async (req: Request, res: Response): Promise<void> => {
        const postMessageInput: IPostMessageInput =
         req.body as IPostMessageInput;
        res.json(
          await messageService.saveNewMessage(
            postMessageInput
          )
        );
      }
    )
  }
}

export default WebchatApp;