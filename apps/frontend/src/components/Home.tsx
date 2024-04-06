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
        const fetchAuthStatus = async () => {
            try {
                const response = await axios.get('/api/account/auth/status');
                setLoggedIn(response.data.loggedIn);
                setUsersName(response.data.user.username);
            } catch (error) {
                console.error('Error fetching auth status:', error);
            }
        };
    
        fetchAuthStatus();
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
    const handleLogOut = async () => {
        setLoggedIn(false);
        try {
            const res = await axios.post("/api/account/logout");
            console.log(res);
            console.log(res.data);
        } catch (error) {
            console.error('There was an error!', error);
            setLoggedIn(true);
        }
    };

    // handle submitting the answer 
    const handleSubmitAnswer = async (event) => {
        event.preventDefault(); 
        
        if (!displayedQuestion || !displayedQuestion._id) {
            console.error('No question selected or question ID missing.');
            return; // Ensure there's a selected question and it has an ID
        }

        
        // format data ... only need ot send questionText 
        // i don't think this is correct because u should just be able to submit answer 
        const questionData = {
            _id: displayedQuestion._id,
            answer: questionAnswer
        };

        try {
            const res = await axios.post("/api/questions/answer", questionData);
            console.log(res);
            console.log(res.data);
            // update display automatically 
            const updatedQuestion = res.data.question;
            setDisplayedQuestion(updatedQuestion);

            // clear answer field 
            setQuestionAnswer("");

            // (!!) need to also update display of questions automatically 

            // indicate success to user 
            alert("Answer submitted successfully!");

        } catch (error) {
            console.error('There was an error!', error);
            alert("Failed to submit answer. Please try again.");
        }
    }

    // retrieve JSON of question objects 
    const fetcher = async (url: string) => {
        const res = await axios.get(url);
        return res.data;
      };

    // destructure JSON object to retrieve data returned from fetcher 
    const { data } = useSWR('/api/questions/', fetcher, { refreshInterval: 2000 })

    // refreshInterval will automatically fetch every 2 seconds 

    // handle error fetching questions 

    // handle clicking on card 
    const handleCardClick = (question) => {
        setDisplayedQuestion(question); // update question to display based on click 
    }

  // eslint-disable-next-line unicorn/prefer-ternary
  if (loggedIn) { 
    return (
    <> 
 <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', backgroundColor: "pink" }}>
    <div className="header" style={{ 
      width: '100%', 
      padding: '20px', 
      backgroundColor: '#A94064', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      color: "white", 
      textAlign: 'center' 
    }}>
      <h1 style={{ margin: 0 }}>CampusWire Lite</h1>
      <h2> Hi {usersName}! </h2> 
      <Button variant="primary" onClick={handleLogOut} style={{ marginTop: '10px' }}>
        Log Out
      </Button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '20px', width: '90%', maxWidth: '1200px' }}>
      <div className='left-pane' style={{ 
        flex: 1, 
        backgroundColor: '#fff', 
        padding: '20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        overflowY: 'auto', /* if there are many questions, enable scrolling */
        height: '600px', /* Fixed height for scroll */
      }}>
    {/* define an add new question button that sends a post request*/}

    <Button variant="primary" onClick={addNewQuestion} style={{ marginBottom: '20px' }}>
          Add New Question +
        </Button>


        {data && data.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.map((question) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li key={question.id} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleCardClick(question)}>
                <div className="card" style={{ padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h5 className="card-title">{question.questionText}</h5>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions yet. Add a question to begin!</p>
        )}

        {/* only show the modal when state is true, also closing makes modal not show by setting state to false*/}
        <QuestionModal
        show={showModal}
        handleClose={() => setModalShow(false)}
      />

    </div>

    <div className="right-pane" style={{ 
        flex: 2, 
        backgroundColor: '#fff', 
        padding: '20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        overflowY: 'auto', /* if content is too long, enable scrolling */
        height: '600px', /* Fixed height for scroll */
      }}>
        {/* display selected question */}
        
        {displayedQuestion ? (
          <>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h5 className="card-title">{displayedQuestion.questionText}</h5>
              <p><em>Author:</em> {usersName}</p>
              <p><em>Answer:</em> {displayedQuestion.answer}</p>
            </div>
            <div className="answerQuestion">
              <Form onSubmit={handleSubmitAnswer}>
                <Form.Group className="mb-3">
                  <Form.Label>Answer this question:</Form.Label>
                  <Form.Control as="textarea" placeholder="Enter answer" value={questionAnswer} onChange={e => setQuestionAnswer(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit Answer
                </Button>
              </Form>
            </div>
          </>
        ) : "Click a question to view details."}

    </div> 
    </div> 
    </div> 

    </>
    
    );  
  } else { // user is logged out
    return (
    <>
   <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', backgroundColor: "pink" }}>
    <div className="header" style={{ 
      width: '100%', 
      padding: '20px', 
      backgroundColor: '#A94064', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      color: "white", 
      textAlign: 'center' 
    }}>
        <h1 style={{ margin: 0 }}>CampusWire Lite</h1>
      </div> 

      <div style={{ 
        marginTop: '50px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>


    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '20px', width: '90%', maxWidth: '1200px' }}>
      <div className='left-pane' style={{ 
        flex: 1, 
        backgroundColor: '#fff', 
        padding: '20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        overflowY: 'auto', /* if there are many questions, enable scrolling */
        height: '600px', /* Fixed height for scroll */
      }}>

<Button variant="primary" onClick={routeChange} style={{ marginBottom: '20px', width: '200px' }}>
          Log in to submit a question 
        </Button>

        {data && data.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {data.map((question) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div key={question.id} className="card" style={{ padding: '20px', width: '200px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer'}} onClick={() => handleCardClick(question)}>
                <h5 className="card-title">{question.questionText}</h5>
              </div>
            ))}
          </div>
        ) : (
          <p>No questions yet. Log in to add a question!</p>
        )}
    </div> 
        {/* conditionally display based on which question selected 
        if there is something selected, display it, otherwise tell them to select */}
        <div className="right-pane" style={{ 
      flex: '1', 
      backgroundColor: '#fff', 
      padding: '20px', 
      overflowY: 'auto' /* if content is too long, enable scrolling */
    }}>
                    {displayedQuestion ? (
                        <div className="card">
                            <h5 className="card-title">{displayedQuestion.questionText}</h5>
                            <em> Author: </em> 
                            <p> {usersName} </p> 
                            <em> Answer: </em> 
                            <p> {displayedQuestion.answer} </p> 
                        </div>
                    ) : "Click a question to view details."}
        </div>
        </div> 
        </div> 
        </div> 
        </>
        )} 
}

export default Home;
