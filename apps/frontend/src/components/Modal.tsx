import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

interface QuestionModalProps {
    show: boolean;
    handleClose: () => void;
  }

const QuestionModal: React.FC<QuestionModalProps> = ({ show, handleClose }) => {
  const [question, setQuestion] = useState("");

  const submitQuestion = (e) => {
    e.preventDefault();

    // try to post question 
    axios.post('/api/questions/add', { questionText: question }).then(res => {
      console.log(res); 
      console.log(res.data);
  }).catch(error => {
      console.error('Error submitting question!', error);
  });
      // Close the modal after submission
      handleClose();

      // clear form for next user input 
      setQuestion('');
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitQuestion}>
          <Form.Group className="mb-3" controlId="questionInput">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Question
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionModal;
