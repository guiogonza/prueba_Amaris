import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const SuscriptionForm = () => {
  const [clientId, setClientId] = useState('');
  const [fundId, setFundId] = useState('');
  const [amount, setAmount] = useState('');
  const [clients, setClients] = useState([]);
  const [funds, setFunds] = useState([]);
  const [clientExists, setClientExists] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchFunds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/funds');
        setFunds(response.data);
      } catch (error) {
        console.error('Error fetching funds:', error);
      }
    };

    fetchClients();
    fetchFunds();
  }, []);

  const subscribe = async () => {
    try {
      const response = await axios.post('http://localhost:5000/subscribe', { client_id: clientId, fund_id: fundId, amount });
      alert(`Suscripción exitosa: ${response.data.transaction_id}`);
      setMessage('');
      // Limpiar los campos del formulario
      setClientId('');
      setFundId('');
      setAmount('');
    } catch (error) {
      if (error.response.status === 400) {
        setMessage(error.response.data.message);
        setClientExists(false);
      } else {
        alert(error.response.data.message);
      }
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Container>
      <h2>Suscribirse a un Fondo</h2>
      {message && <Alert variant="danger">{message}</Alert>}
      <Form>
        <Form.Group>
          <Form.Label>Cliente</Form.Label>
          <Form.Control as="select" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Seleccione un cliente</option>
            {clients.map((client) => (
              <option key={client.ClienteId} value={client.ClienteId}>{client.Name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Fondo</Form.Label>
          <Form.Control as="select" value={fundId} onChange={(e) => setFundId(e.target.value)}>
            <option value="">Seleccione un fondo</option>
            {funds.map((fund) => (
              <option key={fund.Id} value={fund.Id}>{fund.Nombre} - Monto Mínimo: {fund.MontoMinimo}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control type="text" value={amount} onChange={handleAmountChange} />
        </Form.Group>
        <Button variant="primary" onClick={subscribe}>Suscribirse</Button>
      </Form>
    </Container>
  );
};

export default SuscriptionForm;