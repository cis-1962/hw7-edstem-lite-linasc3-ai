import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import axios from 'axios';


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

   // update for log in 

    const handleSubmit = event => {
        event.preventDefault(); 
        
        // format user in object database expects 
        const user = {
            name: username, 
            password: password
        };

        axios.post("/account/login", user) // send post request with username and password to attempt to log in 
            .then(res => {
                console.log(res); 
                console.log(res.data);
                navigate("localhost:3000/home") 
                // go to home page if successful 
            })
            .catch(error => {
                // alert if failed 
                console.error('There was an error!', error);
                alert("Failed to log in. Please try again.");
            });


    }

  return (
    <><h1> Sign Up </h1>
    <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username:</Form.Label>
              <Form.Control type="textarea" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
          </Form.Group>

          <Button variant="primary" type="submit">
              Log in
          </Button>

          <p> Do not have an account? </p>
          <Link to="localhost:3000/signup">Sign up here.</Link>

      </Form></>
  );
}

export default Login;
