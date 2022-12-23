import {v4 as uuidv4} from 'uuid';


class Message {
  id: string;
  userId: string;
  text: string;
  
  constructor(id: string, userId: string, text: string) {
    this.id = id;
    this.text=text;
    this.userId=userId;
  };

}

export default Message;