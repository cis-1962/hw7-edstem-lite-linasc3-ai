// define schema and model objects for question model 

// adapted from Mongoose Type Script docs

import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Create an interface representing a document in MongoDB.
// interface is how we can provide type safety 
interface IUser {
  username: string;
  password: string;
}

// 2. Create a Schema corresponding to the document interface.
// schemas are how you tell mongoose what your documents look like ... aka structure of document, default values, DIFF from typescript interfaces
// so, you need to define both a document interface and schema 
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// 3. Create a Model.
// models in mongoose provide INTERFACE to database for querying, updating, deleting records 
const User = model<IUser>('User', userSchema);

userSchema.method('checkPassword', async function checkPassword(possiblePass) { // defining method to check password 
    const match = await bcrypt.compare(possiblePass, this.password);
    return match;
  });

export default User; 

