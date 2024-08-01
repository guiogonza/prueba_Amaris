import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL; // Usar variable de entorno

const ClientForm = ({ onClientAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const addClient = async () => {
    try {
      const response = await axios.post(`${API_URL}/clients`, { name, email, phone });
      setMessage('Cliente creado con éxito.');
      onClientAdded(response.data.client_id, name, email, phone);
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Error creando el cliente:', error); // Añadir log para verificar errores
      setMessage('Error creando el cliente.');
    }
  };

  return (
    <Container>
      <h2>Agregar Cliente</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={addClient}>Agregar Cliente</Button>
      </Form>
    </Container>
  );
};

export default ClientForm;
