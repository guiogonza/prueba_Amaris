import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup } from 'react-bootstrap';
import log from 'loglevel';

log.setLevel('debug');

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL; // Usar variable de entorno

=======
>>>>>>> a56f19c81f98fd71e638592bd7853bfbcaab880e
const FundsList = () => {
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(`${API_URL}/funds`);
=======
        const response = await axios.get('http://localhost:5000/funds');
>>>>>>> a56f19c81f98fd71e638592bd7853bfbcaab880e
        log.debug('Funds data:', response.data);  // Verifica la estructura de los datos aquí
        setFunds(response.data);
      } catch (error) {
        log.error('Error fetching funds:', error);
      }
    };

    fetchFunds();
  }, []);

  return (
    <Container>
      <h2>Fondos Disponibles</h2>
      <ListGroup>
        {funds.map((fund) => (
          <ListGroup.Item key={fund.Id}>
            <strong>{fund.Nombre}</strong><br />
            ID del Fondo: {fund.Id} <br />
            Monto Mínimo: {fund.MontoMinimo} <br />
            Categoría: {fund.Categoria}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default FundsList;
