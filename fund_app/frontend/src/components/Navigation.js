import React, { useState } from 'react';
import SuscriptionForm from './SuscriptionForm';
import UnsubscriptionForm from './UnsubscriptionForm';
import TransactionsList from './TransactionsList';
import FundsList from './FundsList';
import ClientsList from './ClientsList';
import ClientForm from './ClientForm';
import Header from './Header';
import Footer from './Footer';
import { Container, ButtonGroup, Offcanvas, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom.css';

const Navigation = () => {
  const [currentView, setCurrentView] = useState('home');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    }
  };

  const handleClientAdded = (clientId, name, email, phone) => {
    // Puedes manejar la adición del cliente aquí si es necesario
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container fluid className="flex-grow-1 d-flex flex-column">
        <Button variant="primary" onClick={handleShow} className="menu-button">
          Menú
        </Button>

        <Offcanvas show={show} onHide={handleClose} placement="start" style={{ backgroundColor: '#87CEFA', width: '250px' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="w-100 text-center" style={{ fontSize: '24px' }}>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="offcanvas-body">
            <ButtonGroup vertical className="w-100">
              <Button variant="primary" className="mb-2" onClick={() => { setCurrentView('subscribe'); handleClose(); }}>Suscribirse a un Fondo</Button>
              <Button variant="danger" className="mb-2" onClick={() => { setCurrentView('unsubscribe'); handleClose(); }}>Cancelar Suscripción</Button>
              <Button variant="info" className="mb-2" onClick={() => { setCurrentView('transactions'); handleClose(); }}>Ver Transacciones</Button>
              <Button variant="secondary" className="mb-2" onClick={() => { setCurrentView('funds'); handleClose(); }}>Ver Fondos Disponibles</Button>
              <Button variant="success" className="mb-2" onClick={() => { setCurrentView('clients'); handleClose(); }}>Ver Clientes</Button>
              <Button variant="warning" className="mb-2" onClick={() => { setCurrentView('addClient'); handleClose(); }}>Agregar Cliente</Button>
            </ButtonGroup>
          </Offcanvas.Body>
        </Offcanvas>

        <div className="container-main flex-grow-1">
          {renderView()}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Navigation;
