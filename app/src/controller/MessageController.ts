
import { Body } from "rest-annotations";
import {Path, GET, POST, PathParam} from "typescript-rest";
import MessageService from "../service/MessageService";

@Path("/chat/conversation")
export default class MessageController {

  private messageService;

  constructor() {
    this.messageService = new MessageService();
  }
  
  @Path(":id")
  @GET
  getConversation(
    @PathParam('id') id: string): string {
    return "Getting conversation of id: " + id;
  }
  
  @Path("/message")
  @POST
  postMessage(@Body text: string, @Body conversationId: string ) {
    this.messageService.saveNewMessage(text, conversationId);
  }
}