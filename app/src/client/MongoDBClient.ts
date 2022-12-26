import { MongoClient, Db } from 'mongodb';
import Conversation from "../business/Conversation";
import Message from "../business/Message";
import User from "../business/User";

const DB_NAME: string = 'MICCChatDB';
const PORT: Number = 27017;
const DB_USER = "admin_mongo";
const DB_PASS = "admin_mongo";


class MongoDBClient {
  url: string;
  client: MongoClient;
  db: Db;
  
  private constructor() {
    this.url = `mongodb://${DB_USER}:${DB_PASS}@localhost:${PORT}`;
    this.client = new MongoClient(this.url);
  }
  
  public async initDB(db_name: string) {
    await this.client.connect();
    this.db = this.client.db(db_name);
  }

  public async restartDB(db_name: string) {
    await this.db.dropDatabase();
    await this.initDB(db_name);
  }

  public async closeDB() {
    await this.client.close();
  }

  public getMongoClient(): MongoClient {
    return this.client
  };
  
  public async postUser(user: User): Promise<void> {
    await this.db.collection<User>("users").insertOne(user);
  }
  
  public async postConversation(conversation: Conversation): Promise<void> {
    await this.db.collection<Conversation>("conversation").insertOne(conversation);
  }
  
  public async postMessage(message: Message): Promise<void> {
    await this.db.collection<Message>("message").insertOne(message);
  }
  
  public async linkMessageAndConversation(messageId: string, conversationId: string) {
    await this.db.collection<Conversation>("conversation").updateOne(
      {id: conversationId}, {$push: {messageIds: messageId}}
    );
  }
  
  public async saveMessageAndAddToConversation(message: Message, conversationId: string): Promise<void> {
    await this.postMessage(message);
    await this.linkMessageAndConversation(message.id, conversationId);
  }
  
  public async getUser(userId: string): Promise<User|null> {
    return this.db.collection<User>("users").findOne({ id: userId });
  }
  
  public async getConversation(conversationId: string): Promise<Conversation|null> {
    return await this.db.collection<Conversation>("conversation").findOne({ id: conversationId });
  }
  
  public async getMessages(conversationId: string): Promise<Message[]> {
    
    const possibleConversation: Conversation|null = await this
    .getConversation(conversationId);
    
    const messageIds: string[] =
      possibleConversation!=null ? possibleConversation.messageIds : [];
    
    return (await this.db.collection<Message>("message").find(
      {id: {$in: messageIds}}
    ).toArray());
  }
  
  public async getUsers(userIds: string[]): Promise<User[]> {
    return await this.db.collection<User>("users")
      .find({id: {$in: userIds}}).toArray();
  }

  public async userExists(userId: string): Promise<Boolean> {
    const searchResult: User|null = await this.getUser(userId);
    if(searchResult===null) return false;
    return true;
  }

  public async conversationExists(userId: string): Promise<Boolean> {
    const searchResult: Conversation|null = await this.getConversation(userId);
    if(searchResult===null) return false;
    return true;
  }
  
  public static async getMongoDBClient(db_name: string = DB_NAME): Promise<MongoDBClient> {
    const instance = new MongoDBClient();
    
    return new Promise( (resolve, reject) => {
      try {
        instance.initDB(db_name).then( () => {
          resolve(instance);
        });
      } catch {
        reject();
      }
    });
  }

}

export default MongoDBClient;