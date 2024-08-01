import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const UnsubscriptionForm = () => {
  const [userId, setUserId] = useState('');
  const [fundId, setFundId] = useState('');
  const [clients, setClients] = useState([]);
  const [clientsWithTransactions, setClientsWithTransactions] = useState([]);
  const [clientFunds, setClientFunds] = useState([]);
  const [funds, setFunds] = useState([]);

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

    const fetchClientsWithTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/all_transactions');
        const uniqueClientIds = [...new Set(response.data.map(txn => txn.ClientID))];
        setClientsWithTransactions(uniqueClientIds);
      } catch (error) {
        console.error('Error fetching clients with transactions:', error);
      }
    };

    fetchClients();
    fetchFunds();
    fetchClientsWithTransactions();
  }, []);

  const fetchClientFunds = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/client_funds?client_id=${clientId}`);
      setClientFunds(response.data);
    } catch (error) {
      console.error('Error fetching client funds:', error);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setUserId(clientId);
    fetchClientFunds(clientId);
  };

  const unsubscribe = async () => {
    try {
      const response = await axios.post('http://localhost:5000/unsubscribe', { client_id: userId, fund_id: fundId });
      alert(`Cancelación exitosa: ${response.data.transaction_id}`);
      setClientFunds(clientFunds.filter(fund => fund.FundID !== fundId));
      setFundId('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getFundName = (fundId) => {
    const fund = funds.find(f => f.Id === fundId);
    return fund ? fund.Nombre : 'Desconocido';
  };

  return (
    <Container>
      <h2>Cancelar Suscripción de un Fondo</h2>
      <Form>
        <Form.Group>
          <Form.Label>Cliente</Form.Label>
          <Form.Control as="select" value={userId} onChange={handleClientChange}>
            <option value="">Seleccione un cliente</option>
            {clients
              .filter(client => clientsWithTransactions.includes(client.ClienteId))
              .map((client) => (
                <option key={client.ClienteId} value={client.ClienteId}>{client.Name}</option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Fondo</Form.Label>
          <Form.Control as="select" value={fundId} onChange={(e) => setFundId(e.target.value)} disabled={!userId}>
            <option value="">Seleccione un fondo</option>
            {clientFunds.map((fund) => (
              <option key={fund.FundID} value={fund.FundID}>{getFundName(fund.FundID)}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="danger" onClick={unsubscribe} disabled={!fundId}>Cancelar Suscripción</Button>
      </Form>
    </Container>
  );
};

export default UnsubscriptionForm;
