// add routes that handle login system 

// router used to organize routes and handlers (mini app)
// route: section of express code that associates HTTP verb, url path/pattern, and function to handle the pattern 

import express from 'express';
import User from '../models/user';

// create router
const router = express.Router(); 

// post route for signup with body of username and password 
router.post('/signup', async (req, res) => {
    const {username, password} = req.body; 

    // make sure username and password exist
    if (!username || !password) {
        return res.status(400).send({message: "You must provide a username and password."});
        // 400 bc bad request due to client error
    }

    // now let's actually try to add the user
    try { // !!!!!! check whether searching in user is correct 
        const sameUser = await User.findOne({username}); // look for user with matching username as this user 
        if (sameUser) { // if this username is already taken, send bad request client error message telling them to get another username 
            return res.status(401).send({message: 'User with this name already exists.'});
        }
        const newUser = new User({username, password}); // if user doesn't exist already, we can create new one!
        await newUser.save(); // save the user in database
        // let user know it succeeded
        res.status(201).send({message: "Successfully created user"})
    } catch (error) {
        // handle any errors
        res.status(500).send({message: 'Error, could not create user', error: error.message})
    }
})

// post route for login with body of username and password 

router.post('/login', async(req, res) => {
    const {username, password} = req.body; 

    const user = await User.findOne({username}); 
     // make sure username and password exist
     if (!user) {
        return res.status(401).send({message: "User does not exist"});
        // 400 bc bad request due to client error
    } else { 
    try {
        const match = await user.checkPassword(password); // check if password is correct, derived from the schema method we defined  
        if (match) { 
            res.status(200).send("Login successful.")
        } else {
            // wrong password 
            res.status(401).send("Wrong password.")
        }
    } catch (error) {
        res.status(500).send("Internal server error. Could not log in.")
    }
    } 
})

// post route for logout 
router.post('/logout', async(req, res) => {
    
})



export default router; 



