import {v4 as uuidv4} from 'uuid';
import Message from "./Message";
import User from "./User";


class Conversation {
  id: string;
  title: string;
  subject: string;
  messageIds: string[];
  
  constructor(id: string, title: string, subject: string, messageIds: string[]) {
    this.id=id;
    this.title=title;
    this.subject=subject;
    this.messageIds=messageIds;
  }
}

export default Conversation;