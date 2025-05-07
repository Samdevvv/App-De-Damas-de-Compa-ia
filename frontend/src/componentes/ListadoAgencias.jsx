import React, { useState } from 'react';
import '../estilos/ListadoAgencias.css';
import '../estilos/Header.css';
import Header from './Header';
import { FaSearch, FaTimes, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaEnvelope, FaPhone, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import defaultProfilePic from '../assets/perfil agencia.png';
import logoImage from  '../assets/logo png.png';

const ListadoAgencias = ({ setMenu, userLoggedIn, handleLogout }) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample agency data based on PerfilAgencia.jsx structure
  const agencies = [
    {
      nombre: "Élite Acompañantes",
      ubicacion: "Barcelona, España",
      fotoPerfil: defaultProfilePic,
      descripcion: "Agencia premium especializada en servicios de acompañamiento para eventos de alto nivel. Contamos con los mejores profesionales del sector.",
      telefono: "+34 913 456 789",
      email: "contacto@eliteacompanantes.com",
      fechaRegistro: "Marzo 2022",
      servicios: ["Eventos corporativos", "Galas benéficas", "Congresos internacionales"],
      horarioAtencion: "Lunes a Viernes: 9:00 - 18:00",
      redes: {
        instagram: "elite_acompanantes",
      },
    },
    {
      nombre: "Luxury Escorts",
      ubicacion: "Madrid, España",
      fotoPerfil: defaultProfilePic,
      descripcion: "Ofrecemos servicios exclusivos de compañía para clientes exigentes. Calidad y discreción garantizadas.",
      telefono: "+34 914 567 890",
      email: "info@luxuryescorts.com",
      fechaRegistro: "Enero 2023",
      servicios: ["Cenas privadas", "Viajes de lujo", "Eventos VIP"],
      horarioAtencion: "24/7",
      redes: {
        instagram: "luxury_escorts",
      },
    },
  ];

  const openFiltersModal = () => {
    setShowFiltersModal(true);
  };

  const closeFiltersModal = () => {
    setShowFiltersModal(false);
  };

  // Filter agencies based on search query
  const filteredAgencies = agencies.filter(agency =>
    agency.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.ubicacion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigation = (page) => {
    setMenu(page);
  };

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Header onNavigate={setMenu} userLoggedIn={userLoggedIn} handleLogout={handleLogout} />
        <div className="hero-content">
          <h1>Encuentra la Agencia Perfecta</h1>
          <p>Explora nuestra selección de agencias de acompañamiento de alta calidad.</p>
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar agencias por nombre, ubicación o servicios..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button" onClick={openFiltersModal}>
                <FaSearch size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="agencies-section">
        <div className="container">
          <div className="section-header">
            <h2>Agencias Disponibles</h2>
          </div>
          <div className="agencies-container">
            {filteredAgencies.length > 0 ? (
              filteredAgencies.map((agency, index) => (
                <div key={index} className="agency-card">
                  <div className="agency-image-container">
                    <img src={agency.fotoPerfil} alt={agency.nombre} className="agency-image" />
                  </div>
                  <div className="agency-info">
                    <h3>{agency.nombre}</h3>
                    <p className="agency-location">
                      <FaMapMarkerAlt /> {agency.ubicacion}
                    </p>
                    <p className="agency-description">{agency.descripcion}</p>
                    <div className="agency-details">
                      <span><FaBuilding /> Agencia</span>
                      <span><FaCalendarAlt /> Desde {agency.fechaRegistro}</span>
                    </div>
                    <div className="agency-contact">
                      {agency.email && (
                        <span><FaEnvelope /> {agency.email}</span>
                      )}
                      {agency.telefono && (
                        <span><FaPhone /> {agency.telefono}</span>
                      )}
                    </div>
                    <div className="agency-social">
                      {agency.redes.instagram && (
                        <a href={`https://instagram.com/${agency.redes.instagram}`} target="_blank" rel="noopener noreferrer">
                          <FaInstagram className="social-icon instagram" />
                        </a>
                      )}
                      {agency.telefono && (
                        <a href={`https://wa.me/${agency.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <FaWhatsapp className="social-icon whatsapp" />
                        </a>
                      )}
                    </div>
                    <button
                      className="agency-action"
                      onClick={() => handleNavigation('perfilAgencia')}
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No se encontraron agencias que coincidan con la búsqueda.</p>
            )}
          </div>
        </div>
      </section>

      {showFiltersModal && (
        <div className="modal-overlay" onClick={closeFiltersModal}>
          <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Búsqueda Avanzada</h3>
              <button className="close-modal" onClick={closeFiltersModal}>
                <FaTimes size={24} />
              </button>
            </div>
            <div className="filters-container-modal">
              <div className="filter-group">
                <label>Ubicación</label>
                <select className="filter-select">
                  <option value="">Todas las ubicaciones</option>
                  <option value="barcelona">Barcelona</option>
                  <option value="madrid">Madrid</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Servicios</label>
                <select className="filter-select">
                  <option value="">Todos los servicios</option>
                  <option value="eventos">Eventos corporativos</option>
                  <option value="galas">Galas benéficas</option>
                  <option value="congresos">Congresos internacionales</option>
                </select>
              </div>
              <button className="apply-filters" onClick={closeFiltersModal}>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
      
       {/* Footer - adaptado para móviles */}
            <footer className="footer">
              <div className="footer-content">
                <div className="footer-main">
                  <div className="footer-logo">
                    <img src={logoImage} alt="Telo Fundi" className="footer-logo-image" />
                    <p>La mejor plataforma para encontrar compañía de calidad en toda República Dominicana</p>
                  </div>
      
                  <div className="footer-links">
                    <div className="footer-links-column">
                      <h4>Categorías</h4>
                      <ul>
                        <li><a href="#">Escorts Femeninas</a></li>
                        <li><a href="#">Trans y Travestis</a></li>
                        <li><a href="#">Escorts Masculinos</a></li>
                        <li><a href="#">Servicios VIP</a></li>
                        <li><a href="#">Masajes</a></li>
                      </ul>
                    </div>
      
                    <div className="footer-links-column">
                      <h4>Para Anunciantes</h4>
                      <ul>
                        <li><a href="#">Publicar Anuncio</a></li>
                        <li><a href="#">Planes Premium</a></li>
                        <li><a href="#">Verificación</a></li>
                      </ul>
                    </div>
      
                    <div className="footer-links-column">
                      <h4>Información</h4>
                      <ul>
                        <li><a href="#">Términos y Condiciones</a></li>
                        <li><a href="#">Cookies</a></li>
                        <li><a href="#">Contacto</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
      
                <div className="footer-bottom">
                  <p>© 2025 Telo Fundi - Todos los derechos reservados</p>
                  <p className="disclaimer">Acceso solo para mayores de 18 años. Este sitio contiene material para adultos.</p>
                </div>
              </div>
            </footer>
    </div>
  );
};

export default ListadoAgencias;