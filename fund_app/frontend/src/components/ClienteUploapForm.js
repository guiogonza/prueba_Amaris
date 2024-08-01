import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

<<<<<<< HEAD

const API_URL = process.env.REACT_APP_API_URL; // Usar variable de entorno

=======
>>>>>>> a56f19c81f98fd71e638592bd7853bfbcaab880e
const ClientUploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
<<<<<<< HEAD
      await axios.post(`${API_URL}/upload_clients`, formData);
=======
      await axios.post('http://localhost:5000/upload_clients', formData);
>>>>>>> a56f19c81f98fd71e638592bd7853bfbcaab880e
      alert('Clientes cargados con éxito');
    } catch (error) {
      console.error('Error uploading clients:', error);
      alert('Error al cargar clientes');
    }
  };

  return (
    <Container>
      <h2>Cargar Clientes</h2>
      <Form>
        <Form.Group>
          <Form.File label="Seleccionar archivo de clientes" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleUpload}>Cargar Clientes</Button>
      </Form>
    </Container>
  );
};

export default ClientUploadForm;
