import WebChatEntity from './WebChatEntity';


class User extends WebChatEntity {
  id: string;
  name: string;
  bio: string;
  email: string;
  
  constructor(id:string, name: string, bio: string, email: string) {
    super();
    this.name=name;
    this.bio=bio;
    this.id=id;
    this.email=email;
  }
}


export default User;