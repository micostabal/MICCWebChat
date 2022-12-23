import {v4 as uuidv4} from 'uuid';


class User {
  id: string;
  name: string;
  bio: string;
  email: string;

  constructor(id:string, name: string, bio: string, email: string) {
    this.name=name;
    this.bio=bio;
    this.id=id;
    this.email=email;
  }
}


export default User;