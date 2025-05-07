import React, { useState, useEffect } from 'react';
import "../estilos/Mainpage.css";
import "../estilos/AgeVerificationModal.css";
import heroImage from "../assets/heroimage2.avif";
import femaleServiceImg from "../assets/Scorts 1.avif";
import transServiceImg from "../assets/trans 1.avif";
import maleServiceImg from "../assets/scort masculino.jpeg";
import companionServiceImg from "../assets/compañia.jpg";
import vipServiceImg from "../assets/vip.jpg";
import massageServiceImg from "../assets/masaje.jpg";
import logoImage from "../assets/logo png.png";
import '../estilos/Header.css';
import Header from './Header';
import { FaSearch, FaTimes } from 'react-icons/fa';

const MainPage = ({ setMenu, userLoggedIn, handleLogout }) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  // Estado para controlar el comportamiento responsive en móviles
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios en el tamaño de la ventana para ajustar elementos responsivos
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Comprobar si el usuario ya verificó su edad al cargar la página
  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (!ageVerified) {
      setShowAgeModal(true);
    }
  }, []);

  

  // Desactivar scroll e interactividad del body cuando la modal de edad está abierta
  useEffect(() => {
    if (showAgeModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      const pageContainer = document.querySelector('.page-container');
      if (pageContainer) {
        pageContainer.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      const pageContainer = document.querySelector('.page-container');
      if (pageContainer) {
        pageContainer.style.pointerEvents = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      const pageContainer = document.querySelector('.page-container');
      if (pageContainer) {
        pageContainer.style.pointerEvents = 'auto';
      }
    };
  }, [showAgeModal]);

  const openFiltersModal = () => {
    setShowFiltersModal(true);
  };

  const closeFiltersModal = () => {
    setShowFiltersModal(false);
  };

  const handleAgeAccept = () => {
    // Guardar en localStorage que el usuario ha verificado su edad
    localStorage.setItem('ageVerified', 'true');
    setShowAgeModal(false);
  };

  const handleAgeCancel = () => {
    window.location.href = 'https://Google.com';
  };

  const fireParticles = Array.from({ length: isMobile ? 15 : 30 }).map((_, index) => (
    <div
      key={index}
      className="fire-particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`
      }}
    />
  ));

  const services = [
    {
      id: 'female',
      title: 'Escorts Femeninas',
      description: 'Acompañantes femeninas de alta calidad para momentos especiales',
      image: femaleServiceImg,
      featured: true
    },
    {
      id: 'trans',
      title: 'Trans y Travestis',
      description: 'Escorts trans y travestis para experiencias únicas',
      image: transServiceImg,
      featured: true
    },
    {
      id: 'male',
      title: 'Escorts Masculinos',
      description: 'Acompañantes masculinos para satisfacer tus deseos',
      image: maleServiceImg,
      featured: true
    },
    {
      id: 'vip',
      title: 'Servicio VIP',
      description: 'Experiencias premium con nuestras/os mejores acompañantes',
      image: vipServiceImg,
      featured: false
    },
    {
      id: 'companion',
      title: 'Servicio de Compañía',
      description: 'Compañía de calidad para eventos, cenas o viajes',
      image: companionServiceImg,
      featured: false
    },
    {
      id: 'massage',
      title: 'Masajes Eróticos',
      description: 'Masajes relajantes y eróticos con final feliz',
      image: massageServiceImg,
      featured: false
    }
  ];

  const getFeaturedServices = () => {
    return services.filter(service => service.featured);
  };

  // Determinar el número de servicios por fila según el tamaño de pantalla
  const getServiceGridColumns = () => {
    return isMobile ? 'repeat(1, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))';
  };

  return (
    <div className="page-container">
      {/* Modal de verificación de edad - Modificado para mejor visualización en móviles */}
      {showAgeModal && (
        <div className="age-modal-overlay">
          <div className="age-modal">
            {fireParticles}
            <img src={logoImage} alt="Telo Fundi Logo" className="age-modal-logo" />
            <p className="age-modal-text">
              Este sitio contiene contenido exclusivo para mayores de 18 años. 
              Al continuar, confirmas que tienes la edad legal para acceder. 
              Telo Fundi no se responsabiliza por accesos no autorizados. 
              Por favor, selecciona una opción para proceder.
            </p>
            <div className="age-modal-buttons">
              <button className="age-accept" onClick={handleAgeAccept}></button>
              <button className="age-cancel" onClick={handleAgeCancel}></button>
            </div>
            <p className="age-modal-footer">Telo Fundi - ©2025</p>
          </div>
        </div>
      )}

      {/* Hero Section - MOVIDO ARRIBA DEL HEADER */}
      <section 
        className="hero-section" 
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-overlay"></div>
        
        {/* Header con logo flotante */}
        <Header onNavigate={setMenu} userLoggedIn={userLoggedIn} handleLogout={handleLogout} />
        
        <div className="hero-content">
          <h1 className='Titulo'>Donde el fuego se sirve sin filtro.</h1>
          <p>Escorts exclusivas, masajes premium y placer VIP en cada rincón de RD.</p>
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder={isMobile ? "Buscar..." : "Buscar por ubicación o servicios..."}
                className="search-input"
                onClick={openFiltersModal}
                readOnly
              />
              <button className="search-button" onClick={openFiltersModal}>
                <FaSearch size={isMobile ? 16 : 20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="featured-services-section">
        <div className="container">
          <div className="section-header">
            <h2>Servicios Destacados</h2>
            <a href="#" className="view-all">Ver todos</a>
          </div>
          <div className="services-container">
            {getFeaturedServices().map(service => (
              <div key={service.id} className="service-card">
                <div className="service-image-container">
                  <img src={service.image} alt={service.title} className="service-image" />
                </div>
                <div className="service-info">
                  <h3>{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-actions">
                    <button className="service-action view">Ver Anuncios</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Todos los servicios - con grid responsive */}
      <section className="all-services-section">
        <div className="container">
          <div className="section-header">
            <h2>Todos los Servicios</h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: getServiceGridColumns() }}>
            {services.map(service => (
              <div key={service.id} className="service-tile">
                <div className="service-tile-image">
                  <img src={service.image} alt={service.title} />
                  <div className="service-tile-overlay">
                    <h3>{service.title}</h3>
                    <button className="service-tile-btn">Ver Más</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner promocional */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h2>¿Quieres más visibilidad?</h2>
            <p>Anuncia tus servicios en nuestra plataforma y llega a miles de clientes potenciales</p>
            <button className="promo-button">Publicar Anuncio</button>
          </div>
        </div>
      </section>

      {/* Servicios populares - con mejor adaptación móvil */}
      <section className="popular-services">
        <div className="container">
          <div className="section-header">
            <h2>¿Qué estás buscando?</h2>
          </div>
          <div className="services-tags">
            {/* Reducir texto en móviles para etiquetas largas */}
            <span className="service-tag">Masajes</span>
            <span className="service-tag">Scorts VIP</span>
            <span className="service-tag">{isMobile ? "Femeninas" : "Escorts Femeninas"}</span>
            <span className="service-tag">{isMobile ? "Trans" : "Trans y Travestis"}</span>
            <span className="service-tag">{isMobile ? "Masculinos" : "Escorts Masculinos"}</span>
            <span className="service-tag">Compañia</span>
            <span className="service-tag">Eventos</span>
          </div>
        </div>
      </section>

      {/* Modal de filtros - adaptado para pantallas pequeñas */}
      {showFiltersModal && (
        <div className="modal-overlay" onClick={closeFiltersModal}>
          <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Búsqueda avanzada</h3>
              <button className="close-modal" onClick={closeFiltersModal}>
                <FaTimes size={isMobile ? 20 : 24} />
              </button>
            </div>

            <div className="filters-container-modal">
              <div className="filter-group">
                <label>Categoría de Servicio</label>
                <select className="filter-select">
                  <option value="">Todas las categorías</option>
                  <option value="female">Escorts Femeninas</option>
                  <option value="trans">Trans y Travestis</option>
                  <option value="male">Escorts Masculinos</option>
                  <option value="vip">Servicios VIP</option>
                  <option value="companion">Servicio de Compañía</option>
                  <option value="massage">Masajes Eróticos</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Ubicación</label>
                <select className="filter-select">
                  <option value="">Todas las ubicaciones</option>
                  <option value="santodomingo">Santo Domingo</option>
                  <option value="santiago">Santiago</option>
                  <option value="puntacana">Punta Cana</option>
                  <option value="lapromana">La Romana</option>
                  <option value="puertoplata">Puerto Plata</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Rango de Precios</label>
                <div className="range-inputs">
                  <select className="filter-select">
                    <option value="">Cualquier precio</option>
                    <option value="economico">Económico</option>
                    <option value="estandar">Estándar</option>
                    <option value="premium">Premium</option>
                    <option value="lujo">Lujo</option>
                  </select>
                </div>
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
              <img src={logoImage} alt="Telo Fundi" className="logofooter" />
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

export default MainPage;