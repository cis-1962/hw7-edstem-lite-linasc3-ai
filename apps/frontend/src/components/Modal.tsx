import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

interface QuestionModalProps {
    show: boolean;
    handleClose: () => void;
  }

const QuestionModal: React.FC<QuestionModalProps> = ({ show, handleClose }) => {
  const [question, setQuestion] = useState('');

  const submitQuestion = async (e) => {
    e.preventDefault();
    // await the result from the route that tries to post the question 
    try {
      await axios.post('/api/questions/add', { question });

      // Close the modal after submission
      handleClose();

      // clear form for next user input 
      setQuestion('');

    } catch (error) {
      console.error("Error submitting question:", error);
      // Handle  error 
    }
  };

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
