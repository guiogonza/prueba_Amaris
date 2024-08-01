import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL; // Usar variable de entorno

const SuscriptionForm = () => {
  const [clientId, setClientId] = useState('');
  const [fundId, setFundId] = useState('');
  const [amount, setAmount] = useState('');
  const [clients, setClients] = useState([]);
  const [funds, setFunds] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/clients`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchFunds = async () => {
      try {
        const response = await axios.get(`${API_URL}/funds`);
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
      const response = await axios.post(`${API_URL}/subscribe`, { client_id: clientId, fund_id: fundId, amount });
      alert(`Suscripción exitosa: ${response.data.transaction_id}`);
      setMessage('');

      // Enviar notificación de suscripción
      await sendSubscriptionNotification(clientId, fundId, amount);

      // Limpiar los campos del formulario
      setClientId('');
      setFundId('');
      setAmount('');
    } catch (error) {
      if (error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        alert(error.response.data.message);
      }
    }
  };

  const sendSubscriptionNotification = async (clientId, fundId, amount) => {
    try {
      await axios.post(`${API_URL}/notify_subscription`, { client_id: clientId, fund_id: fundId, amount });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
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
