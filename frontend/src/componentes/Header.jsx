import React, { useState } from 'react';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import '../estilos/Header.css';
import loginImage from '../assets/logo png.png';

const Header = ({ onNavigate, userLoggedIn = false, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
      setMenuOpen(false); // Cerrar menú al navegar
    }
  };

  const handleProfileNavigation = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const tipoUsuario = user.tipoUsuario || "cliente";
    
    if (tipoUsuario === "cliente") {
      handleNavigation("perfilCliente");
    } else if (tipoUsuario === "agencia") {
      handleNavigation("perfilAgencia");
    } else if (tipoUsuario === "acompanante") {
      handleNavigation("perfilAcompanante");
    }
  };
  
  // Estilo en línea para forzar transparencia
  const headerStyle = {
    background: 'transparent',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: 'none',
    position: 'absolute',
    zIndex: 1000
  };
  
  // Estilos para el botón toggle (NUEVO)
  // No incluimos display: 'flex' aquí para que se maneje desde CSS
  const toggleButtonStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px',
    cursor: 'pointer',
    zIndex: 1200,
    outline: '1px solid rgba(255, 255, 255, 0.3)'
  };
  
  // Estilos para los iconos (NUEVO)
  const iconStyle = {
    color: '#ffffff',
    fill: '#ffffff',
    stroke: '#ffffff',
    strokeWidth: '1px',
    width: '24px',
    height: '24px'
  };
  
  return (
    <header className="header" style={headerStyle}>
      {/* Logo */}
      <div className="logo">
        <img
          src={loginImage}
          alt="Logo"
          onClick={() => handleNavigation('mainpage')}
        />
      </div>
      
      {/* Botón de hamburguesa para móvil - CON NUEVOS ESTILOS */}
      <button 
        className="menu-toggle" 
        onClick={toggleMenu}
        aria-label="Menú"
        style={toggleButtonStyle}
      >
        {menuOpen ? 
          <FaTimes size={24} style={iconStyle} /> : 
          <FaBars size={24} style={iconStyle} />
        }
      </button>
      
      {/* Contenedor de navegación + botones */}
      <div className={`nav-container ${menuOpen ? 'active' : ''}`}>
        {/* Navegación */}
        <nav className="nav">
          <ul>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('mainpage');
                }}
              >
                Inicio
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('homepage');
                }}
              >
                Explorar
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('agencias');
                }}
              >
                Agencias
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('about');
                }}
              >
                Sobre Nosotros
              </a>
            </li>
          </ul>
        </nav>
        
        {/* Botones de autenticación */}
        <div className="auth-buttons">
          {userLoggedIn ? (
            <div className="user-profile-actions">
              <button 
                className="profile-button"
                onClick={handleProfileNavigation}
                title="Ver Perfil"
              >
                <FaUser />
              </button>
              <button 
                className="logout-button"
                onClick={handleLogout}
                title="Cerrar Sesión"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <>
              <button 
                className="login"
                onClick={() => handleNavigation('login')}
              >
                Iniciar Sesión
              </button>
              <button 
                className="signup"
                onClick={() => handleNavigation('registro')}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Overlay para cerrar el menú en móvil */}
      {menuOpen && (
        <div 
          className={`menu-overlay ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;