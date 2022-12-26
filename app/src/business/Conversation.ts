import WebChatEntity from "./WebChatEntity";


class Conversation extends WebChatEntity {
  id: string;
  title: string;
  subject: string;
  messageIds: string[];
  
  constructor(id: string, title: string, subject: string, messageIds: string[]) {
    super();
    this.id=id;
    this.title=title;
    this.subject=subject;
    this.messageIds=messageIds;
  }
}

export default Conversation;