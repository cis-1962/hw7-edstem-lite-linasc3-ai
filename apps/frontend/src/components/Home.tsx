import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';

function Home() {
    // state for whether user is logged in or loggd out 
    const [loggedIn, setLoggedIn] = useState(false)

    // only one question will be selected at any given time for display, so add state 
    const [displayedQuestion, setDisplayedQuestion] = useState(null)

    const navigate = useNavigate(); 

    // navigate to log in when you click the log in button 
    const routeChange = () => {
        navigate("/login")
    }

    // send open modal, then you also need to handle modal by sending post request to add new question 
    const addNewQuestion = () => {
    }

    // handle submitting the answer 
    const handleSubmitAnswer = () => {
    }

    // retrieve JSON of question objects 
    const fetcher = (url: string) => axios.get(url).then((res) => res.data);

    // destructure JSON object to retrieve data returned from fetcher 
    const { data } = useSWR('/api/questions/', fetcher)

    // handle error fetching questions 

    // handle clicking on card 
    const handleCardClick = (question) => {
        setDisplayedQuestion(question); // update question to display based on click 
    }

  if (loggedIn) { 
    <> 
    <div className="header"> {/* TODO: add styling for header */}
    <h1 style={{display: 'flex', justifyContent: 'flex-start'}}> CampusWire Lite </h1> 
    <h2 style={{justifyContent: 'right'}}> Hi </h2> {/* TODO: need to retrieve user's name and display here, and log out button */}
    </div> 

    <div className='left-pane'> 
    {/* define an add new question button that sends a post request*/}
    <Button variant="primary" type="submit" onClick={addNewQuestion}>
              Add New Question + 
    </Button>

    {/* display the questions on left panel*/}
    <ul>
            {data.map((question) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <li key={question.id} className="card" style={{ width: '10rem' }} onClick={() => handleCardClick(question)}>
            <h5 className="card-title">{question.questionText}</h5>
            </li>
        ))}
        </ul>
    </div>

    <div className="right-pane" style={{ marginLeft: '20px' }}>
        {/* display selected question */}

        {displayedQuestion ? (
                        <div className="card">
                            <h5 className="card-title">{displayedQuestion.questionText}</h5>
                            <em> Author: </em> 
                            <p> {displayedQuestion.author} </p> 
                            <em> Answer: </em> 
                            <p> {displayedQuestion.answer} </p> 
                        </div>
                        {/* also need to display a form to answer the question and a submit answer button*/}
                         <div className = "answerQuestion"> 

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Answer this question:</Form.Label>
                        <Form.Control type="textarea" placeholder="Enter answer" value={} onChange={}/>
                    </Form.Group>


                        <Button variant="primary" type="submit" onClick={handleSubmitAnswer}>
                        Submit Answer 
                        </Button>
                        </div> 
                    ) : "Click a question to view details."}

    </div> 


    </>
    return 
  } else { // user is logged out
    <>
    <div className="header"> {/* TODO: add styling for header */}
    <h1 style={{display: 'flex', justifyContent: 'flex-start'}}> CampusWire Lite </h1> 
    </div> 

    <div className='left-pane'>
          <Button variant="primary" type="submit" onClick={routeChange}>
              Log in to submit a question 
          </Button>

          <ul>
            {data.map((question) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <li key={question.id} className="card" style={{ width: '10rem' }} onClick={() => handleCardClick(question)}>
            <h5 className="card-title">{question.questionText}</h5>
            </li>
        ))}
        </ul>

      </div>
        {/* conditionally display based on which question selected 
        if there is something selected, display it, otherwise tell them to select */}
        <div className="right-pane" style={{ marginLeft: '20px' }}>
                    {displayedQuestion ? (
                        <div className="card">
                            <h5 className="card-title">{displayedQuestion.questionText}</h5>
                            <em> Author: </em> 
                            <p> {displayedQuestion.author} </p> 
                            <em> Answer: </em> 
                            <p> {displayedQuestion.answer} </p> 
                        </div>
                    ) : "Click a question to view details."}
        </div>
        </>
        } 
}

export default Home;
