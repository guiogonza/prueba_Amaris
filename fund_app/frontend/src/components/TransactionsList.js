import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, Button, Alert, Badge, Form } from 'react-bootstrap';
import log from 'loglevel';

log.setLevel('debug');

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL; // Usar variable de entorno

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('API_URL:', API_URL); // Verifica si la URL de la API se carga correctamente
        const response = await axios.get(`${API_URL}/all_transactions`);
        log.debug('Transactions data:', response.data); // Verifica la estructura de los datos aquí
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        log.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [API_URL]);

  const filterTransactions = (clientId) => {
    log.debug('Filtering transactions for Client ID:', clientId);
    if (clientId.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(txn => txn.ClientID.includes(clientId));
      log.debug('Filtered Transactions:', filtered);
      setFilteredTransactions(filtered);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterTransactions(value);
  };

  const deleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`${API_URL}/transaction/${transactionId}`);
      const updatedTransactions = transactions.filter(txn => txn.TransaccionId !== transactionId);
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setMessage('Transacción eliminada con éxito.');
    } catch (error) {
      log.error('Error deleting transaction:', error);
      setMessage('Error eliminando la transacción.');
    }
  };

  return (
    <Container>
      <h2>Transacciones <Badge variant="secondary">{filteredTransactions.length}</Badge></h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form.Group>
        <Form.Label>Buscar por Cliente ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el Cliente ID"
          value={searchTerm}
          onChange={handleChange}
        />
      </Form.Group>
      <ListGroup>
        {filteredTransactions.map((txn) => (
          <ListGroup.Item key={txn.TransaccionId}>
            <div>
              <strong>Cliente ID:</strong> {txn.ClientID} <br />
              <strong>Tipo:</strong> {txn.Type} <br />
              <strong>Fondo ID:</strong> {txn.FundID} <br />
              <strong>Nombre del Fondo:</strong> {txn.FundName} <br />
              <strong>Monto:</strong> {txn.Amount}
            </div>
            <Button
              variant="danger"
              onClick={() => deleteTransaction(txn.TransaccionId)}
              style={{ marginTop: '10px' }}
            >
              Eliminar Transacción
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default TransactionsList;
