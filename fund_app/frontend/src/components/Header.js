import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <Button variant="primary" onClick={onMenuClick} className="menu-button">
        Menú
      </Button>
      <h1 className="header-title">Gestión de Fondos</h1>
    </header>
  );
};

export default Header;
