import React, { useState, useEffect } from 'react';
import "../estilos/SobreNosotros.css";
import logoImage from "../assets/logo png.png";
import '../estilos/Header.css';
import Header from './Header';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const SobreNosotros = ({ setMenu, userLoggedIn, handleLogout }) => {
  const [showAgeModal, setShowAgeModal] = useState(false);

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

  const handleAgeAccept = () => {
    // Guardar en localStorage que el usuario ha verificado su edad
    localStorage.setItem('ageVerified', 'true');
    setShowAgeModal(false);
  };

  const handleAgeCancel = () => {
    window.location.href = 'https://Google.com';
  };

  const fireParticles = Array.from({ length: 30 }).map((_, index) => (
    <div
      key={index}
      className="fire-particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`
      }}
    />
  ));

  return (
    <div className="page-container">
      {/* Modal de verificación de edad */}
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

      {/* Header */}
      <Header onNavigate={setMenu} userLoggedIn={userLoggedIn} handleLogout={handleLogout} />

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-left">
              <img src={logoImage} alt="Telo Fundi Logo" className="about-logo" />
              <h1>Sobre Telo Fundi</h1>
              <p className="tagline">Donde el placer y la exclusividad se encuentran en República Dominicana.</p>
            </div>
            <div className="about-right">
              <h2>Nuestra Historia</h2>
              <p className='Historia'>
                Fundada en 2025, Telo Fundi nace con la visión de transformar la industria de servicios de compañía en
                República Dominicana. Somos una plataforma premium que conecta a clientes con acompañantes de alta calidad,
                ofreciendo experiencias únicas y personalizadas en un entorno seguro y discreto.
              </p>
              <p className='Historia'>
                En Telo Fundi, creemos en la libertad de disfrutar sin prejuicios. Nuestra misión es proporcionar un espacio
                donde la pasión, el lujo y la autenticidad se fusionan para crear momentos inolvidables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="services-section">
        <div className="container">
          <h2>¿Qué Hacemos?</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>Servicios de Acompañantes</h3>
              <p>
                Ofrecemos una selección de escorts femeninas, masculinas, trans y travestis, así como servicios VIP y de
                compañía para eventos, cenas o viajes.
              </p>
            </div>
            <div className="service-item">
              <h3>Conexión Cliente y Acompañante</h3>
              <p>
                Facilitamos conexiones auténticas y seguras entre clientes y acompañantes, garantizando experiencias personalizadas que cumplen con las expectativas de ambos.
              </p>
            </div>
            <div className="service-item">
              <h3>Sistema de Puntos</h3>
              <p>
                Nuestro sistema de puntos recompensa a los usuarios frecuentes con beneficios exclusivos, descuentos y acceso a servicios premium.
              </p>
            </div>
            <div className="service-item">
              <h3>Categorías de Servicios</h3>
              <p>
                Permitimos diversas categorías de servicios, desde compañía estándar hasta experiencias especializadas, adaptadas a las preferencias de cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2>Contáctanos</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <p className='Historia'>+1 (809) 555-1234</p>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <p className='Historia'>info@telofundi.com</p>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <p className='Historia'>Santo Domingo, República Dominicana</p>
              </div>
            </div>
            <div className="contact-form">
              <h3>Envíanos un Mensaje</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Nombre" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Correo Electrónico" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Mensaje" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-button">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-logo">
              <img src={logoImage} alt="Telo Fundi" className="footer-logo-image" />
              <p>La mejor plataforma para encontrar compañía de calidad en toda República Dominicana</p>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Información</h4>
                <ul>
                  <li><a href="#" onClick={() => setMenu('terminos')}>Términos y Condiciones</a></li>
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

export default SobreNosotros;