import React, { useState } from 'react';
import SuscriptionForm from './SuscriptionForm';
import UnsubscriptionForm from './UnsubscriptionForm';
import TransactionsList from './TransactionsList';
import FundsList from './FundsList';
import ClientsList from './ClientsList';
import ClientForm from './ClientForm';
import { Container, Button, ButtonGroup } from 'react-bootstrap';

const Navigation = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'subscribe':
        return <SuscriptionForm />;
      case 'unsubscribe':
        return <UnsubscriptionForm />;
      case 'transactions':
        return <TransactionsList />;
      case 'funds':
        return <FundsList />;
      case 'clients':
        return <ClientsList />;
      case 'addClient':
        return <ClientForm onClientAdded={handleClientAdded} />;
      default:
        return <div>Por favor, selecciona una opción</div>;
    }
  };

  const handleClientAdded = (clientId, name, email, phone) => {
    // Puedes manejar la adición del cliente aquí si es necesario
  };

  return (
    <Container>
      <h1>Gestión de Fondos</h1>
      <ButtonGroup className="mb-3">
        <Button variant="primary" onClick={() => setCurrentView('subscribe')}>Suscribirse a un Fondo</Button>
        <Button variant="danger" onClick={() => setCurrentView('unsubscribe')}>Cancelar Suscripción</Button>
        <Button variant="info" onClick={() => setCurrentView('transactions')}>Ver Transacciones</Button>
        <Button variant="secondary" onClick={() => setCurrentView('funds')}>Ver Fondos Disponibles</Button>
        <Button variant="success" onClick={() => setCurrentView('clients')}>Ver Clientes</Button>
        <Button variant="warning" onClick={() => setCurrentView('addClient')}>Agregar Cliente</Button>
      </ButtonGroup>
      {renderView()}
    </Container>
  );
};

export default Navigation;
