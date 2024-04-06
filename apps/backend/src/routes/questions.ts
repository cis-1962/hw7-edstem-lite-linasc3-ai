import express from 'express';
import Question from '../models/question';
import requireAuth from '../middlewares/require-auth'

// create router
const router = express.Router(); 

// route for ADDING a question with a body of questionText 
// require auth because make sure user is only able to add and answer 
// questions if logged in 
router.post('/questions/add', requireAuth, async (req, res, next) => {
    // receive from the request the question details 
    const {questionText} = req.body; 

    // get author from cookie session
    const author = req.session?.user?.username

    // make sure the details exist 
    // don't need to check for answer because may not be an answer yet 
    if (!questionText || ! author) {
        return res.status(400).send({message: "You must provide question text and/or be signed in."});
        // if they don't exist, 400 bc bad request due to client error
    }

    // now let's actually try to add the question 
    try { 
       // it's okay if duplicate question 
        const newQuestion = new Question({questionText, author}); 
        await newQuestion.save(); // save the question in database
        // let user know it succeeded
        res.status(201).send({message: "Successfully added question."})
    } catch (error) {
        // handle any errors
        // res.status(500).send({message: 'Error, could not add question', error: error.message})
        next(error);
    }
}) 


// route for fetching all questions 
router.get('/questions/', async (req, res, next) => {
    // query mongo database with question model to get all question documents
    // route will return array of question documents or empty array if no questions exist 

    try { 
        // note we pass in empty object meaning we don't want to apply filter 
        const questions = await Question.find({}); // pull anything that is of Question model 
        res.status(200).json(questions); // if successful, indicate so by returning all questions in JSON format 
    } catch (error) { 
        // if error getting questions, indicate so to user with server side error message 
        // res.status(500).send({message: "Error fetching questions", error: error.message})
        next(error); 
    }
}) 

// 1. receive request // 2. validate contents // 3. carry out desired action in try catch 
// 4. tell user in response we did it correctly // 5. handle any errors 

// route for adding/updating an ANSWER to a question 
// middlewear for authentication 
router.post('/questions/answer', requireAuth, async (req, res, next) => {
 // accept request body containing id and answer 
 // search for question by ID, update answer field with provided answer text 

 const {_id, answer} = req.body; // start by receiving the id and answer from the request
 // note that _id is built into mongodb 

 // as usual, check if what we received is valid aka not missing
 if (!_id || !answer) { // if missing, return 400 client error code 
    return res.status(400).send({message: "You must provide both a question _ID and answer."})
 }

 // now let's try to update field 
 try { 
    const question = await Question.findById(_id); // need to use mongo's FindById method to search our questions to see if one matches specified id 

    if (!question) { 
        // if we couldn't find the question matching the id, then we need to return not found error 
        return res.status(404).send({message: "Question not found."});

    }

    // now that we've validated we have working question, let's actually update

    question.answer = answer; // update answer field with answer 
    await question.save(); // save it in mongo 

    // tell user we did it successfully 
    res.status(200).send({message: "Answer added or updated successfully", question})
 } catch (error) {
    // handle any errors by sending error message
    // server side error 
    // res.status(500).send({message: "Sorry, we could not update the answer", error: error.message}); 
    next(error);
 }


}) 


export default router;
