import {Path, GET, PathParam} from "typescript-rest";

@Path("/chat")
export default class MICCChatController {
  
  @Path(":conversationId")
  @GET
  getMessages(
    @PathParam('conversationId') conversationId: string): String[] {
    return [];
  }
  
  @GET
  postMessage(
    @PathParam('id') id: string
  ): string {
    return "Getting message of id: " + id;
  }
}