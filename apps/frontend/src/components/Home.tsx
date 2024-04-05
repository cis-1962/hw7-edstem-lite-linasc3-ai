import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import QuestionModal from "./Modal"

function Home() {
    // state for whether user is logged in or loggd out 
    const [loggedIn, setLoggedIn] = useState(false)

    // only one question will be selected at any given time for display, so add state 
    const [displayedQuestion, setDisplayedQuestion] = useState(null)

    // for question answer sending 
    const [questionAnswer, setQuestionAnswer] = useState("")

    // state for whether to show modal
    const [showModal, setModalShow] = useState(false);

    // state for username 
    const [usersName, setUsersName] = useState("");

    const navigate = useNavigate(); 

    // every time page renders, check whether user is logged in 
    // and update state to decide whether or not we should show 
    // certain view 
    useEffect(() => {
        axios.get('/api/auth/status')
            .then(response => {
                setLoggedIn(response.data.loggedIn);
                setUsersName(response.data.username);
            })
            .catch(error => {
                console.error('Error fetching auth status:', error);
                alert("You are not logged in.")
            });
    }, []);

    // navigate to log in when you click the log in button 
    const routeChange = () => {
        navigate("/login")
    }

    // send open modal, then you also need to handle modal by sending post request to add new question 
    const addNewQuestion = () => {
        setModalShow(true) // when user clicks button, trigger modal to show 
    }

    // handle logging out 
    const handleLogOut = () => {
        setLoggedIn(false); 
        axios.post("/account/logout") 
        .then(res => {
            console.log(res); 
            console.log(res.data);
        })
        .catch(error => {
            // alert if failed 
            console.error('There was an error!', error);
            alert("Failed to log out. Please try again.");
        });
    }

    // handle submitting the answer 
    const handleSubmitAnswer = (question) => {
        event.preventDefault(); 
        
        // format data ... only need ot send questionText 
        // i don't think this is correct because u should just be able to submit answer 
        const questionData = {
            questionAnswer: question.questionAnswer
        };

        axios.post("/api/questions/answer", questionData) // send post request to add new question answer to database 
            .then(res => {
                console.log(res); 
                console.log(res.data);
                // needs to continually update 
            })
            .catch(error => {
                // alert if failed 
                console.error('There was an error!', error);
                alert("Failed to add answer. Try again.");
            });
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
    <h2 style={{justifyContent: 'right'}}> Hi {usersName} </h2> {/* TODO: need to retrieve user's name and display here, and log out button */}
    <Button variant="primary" type="submit" onClick={(handleLogOut)}>
              Log Out 
    </Button>
    </div> 

    <div className='left-pane'> 
    {/* define an add new question button that sends a post request*/}
    <Button variant="primary" type="submit" onClick={(addNewQuestion)}>
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

        {/* only show the modal when state is true, also closing makes modal not show by setting state to false*/}
        <QuestionModal
        show={showModal}
        handleClose={() => setModalShow(false)}
      />

    </div>

    <div className="right-pane" style={{ marginLeft: '20px' }}>
        {/* display selected question */}

        {displayedQuestion ? (
                        <><div className="card">
                    <h5 className="card-title">{displayedQuestion.questionText}</h5>
                    <em> Author: </em>
                    <p> {displayedQuestion.author} </p>
                    <em> Answer: </em>
                    <p> {displayedQuestion.answer} </p>
                </div><div className="answerQuestion">
                        <Form onSubmit={handleSubmitAnswer}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Answer this question:</Form.Label>
                                <Form.Control type="textarea" placeholder="Enter answer" value={questionAnswer} onChange={e => setQuestionAnswer(e.target.value)} />
                            </Form.Group>
                        </Form>

                        <Button variant="primary" type="submit" onClick={handleSubmitAnswer}>
                            Submit Answer
                        </Button>
                    </div></> 
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
