import { ObjectId } from "mongodb";

export interface NewUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserAttributes {
  id?: string;
  email: string;
  name: string;
  hashedPassword: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User {
  public id!: string;
  public email!: string;
  public name!: string;
  public password!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}
export default User;
