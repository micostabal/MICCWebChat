
import { Body } from "rest-annotations";
import {Path, GET, POST, PathParam} from "typescript-rest";
import MessageService from "../service/MessageService";
import {
  IPostMessageInput,
  IPostConversationInput,
  IConversation,
  IGetConversationInformationPayload
} from "../interface/controller";


@Path("/chat/conversation")
export default class MessageController {

  private messageService;

  constructor() {
    this.messageService = new MessageService();
  }
  
  @Path("/:id")
  @GET
  async getConversationInformation(
    @PathParam('id') id: string): Promise<IGetConversationInformationPayload> {
    return await this.messageService.getConversationInformationHandler(id);
  }
  
  @Path("/")
  @POST
  async postConversation(@Body conversationInput: IPostConversationInput): Promise<IConversation> {
    return await this.messageService.saveConversation(conversationInput);
  }
  
  @Path("/message")
  @POST
  async postMessage(@Body postMessageInput: IPostMessageInput ) {
    return await this.messageService.saveNewMessage(postMessageInput);
  }
}