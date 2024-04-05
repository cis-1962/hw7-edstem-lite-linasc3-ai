// define schema and model objects for question model 

// adapted from Mongoose Type Script docs

import { Schema, model, Document } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
// interface is how we can provide type safety 
interface IUser extends Document { // extend document so we can use the method check pass 
  username: string;
  password: string;
  logStatus: boolean; 
  checkPassword: (possiblyPassword: string) => Promise<boolean>; // promise because password validation may or may not be successful 
}

// 2. Create a Schema corresponding to the document interface.
// schemas are how you tell mongoose what your documents look like ... aka structure of document, default values, DIFF from typescript interfaces
// so, you need to define both a document interface and schema 
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  logStatus: {type: Boolean, required: false}
});

userSchema.methods.checkPassword = function (this: IUser, possiblyPass: string): boolean { // defining method to check password 
    // const isMatch = await bcrypt.compare(possiblyPass, this.password);
    const isMatch = possiblyPass === this.password; 
    return isMatch
  };
  // return boolean representing whether password correct or not 

// 3. Create a Model.
// models in mongoose provide INTERFACE to database for querying, updating, deleting records 
const User = model<IUser>('User', userSchema);


export default User; 

