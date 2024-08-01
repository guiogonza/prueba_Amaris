import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, Button, Alert, Badge, Form } from 'react-bootstrap';
import log from 'loglevel';

log.setLevel('debug');

const API_URL = process.env.REACT_APP_API_URL; // Usar variable de entorno

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('API_URL:', API_URL); // Imprimir el valor de API_URL para verificar
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/clients`);
        //const response = await axios.get('http://localhost:5000/clients'); // Cambiar a la URL de la API
        log.debug('Clients data:', response.data); // Verifica la estructura de los datos aquí
        console.log('Clients data:', response.data); // Imprimir la respuesta en la consola
        setClients(response.data);
      } catch (error) {
        log.error('Error fetching clients:', error);
        console.error('Error fetching clients:', error); // Imprimir error en la consola
      }
    };

    fetchClients();
  }, []); // Remueve `API_URL` de las dependencias

  const deleteClient = async (clientId) => {
    try {
      await axios.delete(`${API_URL}/client/${clientId}`);
      setClients(clients.filter(client => client.ClienteId !== clientId));
      setMessage('Cliente eliminado con éxito.');
    } catch (error) {
      log.error('Error deleting client:', error);
      setMessage('Error eliminando el cliente.');
    }
  };

  const filteredClients = clients.filter(client =>
    client.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2>Clientes <Badge variant="secondary">{filteredClients.length}</Badge></h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form>
        <Form.Group controlId="formSearch">
          <Form.Control
            type="text"
            placeholder="Buscar por Nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
        </Form.Group>
      </Form>
      <ListGroup>
        {filteredClients.map((client) => (
          <ListGroup.Item key={client.ClienteId}>
            <div>
              <strong>ID:</strong> {client.ClienteId}<br />
              <strong>Nombre:</strong> {client.Name}<br />
              <strong>Email:</strong> {client.Email}<br />
              <strong>Teléfono:</strong> {client.Phone}
            </div>
            <Button
              variant="danger"
              onClick={() => deleteClient(client.ClienteId)}
              style={{ marginTop: '10px' }}
            >
              Eliminar Cliente
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ClientsList;
