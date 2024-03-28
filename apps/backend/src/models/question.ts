// define schema and model objects for question model 

// adapted from Mongoose Type Script docs

import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
// interface is how we can provide type safety 
interface IQuestion {
  questionText: string;
  answer: string;
  author: string; 
}

// 2. Create a Schema corresponding to the document interface.
// schemas are how you tell mongoose what your documents look like ... aka structure of document, default values, DIFF from typescript interfaces
// so, you need to define both a document interface and schema 
const questionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  answer: { type: String},
  author: { type: String, required: true },
});

// 3. Create a Model.
// models in mongoose provide INTERFACE to database for querying, updating, deleting records 
const Question = model<IQuestion>('Question', questionSchema);

export default Question; 
