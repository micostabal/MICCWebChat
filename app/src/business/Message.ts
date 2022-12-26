import WebChatEntity from './WebChatEntity';


class Message extends WebChatEntity {
  id: string;
  userId: string;
  text: string;
  
  constructor(id: string, userId: string, text: string) {
    super();
    this.id = id;
    this.text=text;
    this.userId=userId;
  };

}

export default Message;