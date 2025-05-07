import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaGlobe, 
  FaInstagram, FaWhatsapp, FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight,
  FaCheckCircle
} from 'react-icons/fa';
import '../estilos/PerfilAcompañante.css';
import defaultProfilePic from '../assets/publicacion.jpg';

// Notice we're NOT importing Header here to avoid conflicts

const Perfil = ({ profileData = null, onBackClick }) => {
  const [formattedProfileData, setFormattedProfileData] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  console.log("PerfilAcompañante received data:", profileData);
  console.log("Back function exists:", !!onBackClick);
  
  const API_BASE_URL = 'https://localhost:7134/api/Acompanantes';

  // Process the profile data from API
  useEffect(() => {
    if (profileData) {
      const formatData = () => {
        // Transform API data to match component's expected structure
        return {
          nombre: profileData.NombrePerfil || "Sin nombre",
          ubicacion: `${profileData.Pais || ''}, ${profileData.Ciudad || ''}`,
          fotoPerfil: profileData.FotoPrincipal 
            ? `${API_BASE_URL.replace('/api/Acompanantes', '')}${profileData.FotoPrincipal}`
            : profileData.Fotos && profileData.Fotos.length > 0 
              ? `${API_BASE_URL.replace('/api/Acompanantes', '')}${profileData.Fotos[0].Url}`
              : defaultProfilePic,
          edad: profileData.Edad || 0,
          genero: profileData.Genero || "No especificado",
          descripcion: profileData.Descripcion || "Sin descripción",
          telefono: profileData.Whatsapp || "No disponible",
          email: profileData.Email || "No disponible",
          fechaRegistro: "Registrado en la plataforma",
          servicios: profileData.Servicios ? profileData.Servicios.map(s => s.Nombre) : [],
          disponibilidad: profileData.Disponibilidad || "No especificado",
          idiomas: profileData.Idiomas ? profileData.Idiomas.split(',').map(i => i.trim()) : ["No especificado"],
          tarifaBase: profileData.TarifaBase ? `${profileData.TarifaBase} ${profileData.Moneda || 'USD'}` : "No especificado",
          categorias: profileData.Categorias ? profileData.Categorias.map(c => c.Nombre) : [],
          redes: {
            instagram: profileData.Instagram || "",
            twitter: "",
            facebook: ""
          },
          fotos: profileData.Fotos ? profileData.Fotos.map((foto, index) => ({
            id: index,
            url: `${API_BASE_URL.replace('/api/Acompanantes', '')}${foto.Url}`,
            descripcion: foto.Descripcion || `Foto ${index + 1}`,
            esPrincipal: foto.EsPrincipal || false
          })) : [],
          verificado: profileData.EstaVerificado || false,
          agenciaVerificadora: profileData.NombreAgencia || "Sistema",
          estaDisponible: profileData.EstaDisponible || false,
          altura: profileData.Altura || "No especificado",
          peso: profileData.Peso || "No especificado",
          scoreActividad: profileData.ScoreActividad || "N/A"
        };
      };
      
      setFormattedProfileData(formatData());
    }
  }, [profileData, API_BASE_URL]);

  // Handle forced back action on Escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && !showPhotoModal && onBackClick) {
        console.log("Escape key pressed - forcing back");
        onBackClick();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showPhotoModal, onBackClick]);

  useEffect(() => {
    // Lock body scroll when photo modal is open
    if (showPhotoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPhotoModal]);

  // Handle keyboard navigation for photo modal
  const handleKeyDown = (e) => {
    if (showPhotoModal && formattedProfileData) {
      if (e.key === 'Escape') {
        setShowPhotoModal(false);
      } else if (e.key === 'ArrowRight') {
        const totalPhotos = formattedProfileData.fotos.length;
        setSelectedPhotoIndex((selectedPhotoIndex + 1) % totalPhotos);
      } else if (e.key === 'ArrowLeft') {
        const totalPhotos = formattedProfileData.fotos.length;
        setSelectedPhotoIndex((selectedPhotoIndex - 1 + totalPhotos) % totalPhotos);
      }
    }
  };

  // Add keyboard event listeners
  useEffect(() => {
    if (formattedProfileData) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showPhotoModal, selectedPhotoIndex, formattedProfileData]);

  // Force back function with debugging
  const forceBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Back button clicked - forcing back navigation");
    
    if (typeof onBackClick === 'function') {
      onBackClick();
    } else {
      console.error("onBackClick is not a function:", onBackClick);
      alert("Error: No se puede volver a la página principal. Por favor, use el botón atrás del navegador.");
      // Fallback - try browser back
      try {
        window.history.back();
      } catch (error) {
        console.error("Failed to navigate back:", error);
      }
    }
  };

  if (!formattedProfileData) {
    return (
      <div className="perfil-container">
        {/* Always show back button even during loading */}
        <div className="fixed-back-button-container">
          <button className="fixed-back-button" onClick={forceBack}>
            <FaArrowLeft /> Volver a la página principal
          </button>
        </div>
        <div className="loading-indicator">Cargando perfil...</div>
      </div>
    );
  }

  // Formatear el número de teléfono para el enlace de WhatsApp
  const whatsappNumber = formattedProfileData.telefono ? formattedProfileData.telefono.replace(/\D/g, '') : '';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
  };

  const navigatePhoto = (direction) => {
    const totalPhotos = formattedProfileData.fotos.length;
    if (direction === 'next') {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % totalPhotos);
    } else {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + totalPhotos) % totalPhotos);
    }
  };

  return (
    <div className="perfil-container">
      {/* Fixed position back button - always visible and on top */}
      <div className="fixed-back-button-container">
        <button className="fixed-back-button" onClick={forceBack}>
          <FaArrowLeft /> Volver a la página principal
        </button>
      </div>
      
      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="photo-modal-overlay" onClick={handleClosePhotoModal}>
          <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={handleClosePhotoModal}>
              <FaTimes />
            </button>
            
            <div className="photo-modal-nav">
              <button 
                className="photo-modal-nav-btn prev" 
                onClick={() => navigatePhoto('prev')}
              >
                <FaChevronLeft />
              </button>
              
              <div className="photo-modal-image-container">
                <img 
                  src={formattedProfileData.fotos[selectedPhotoIndex].url} 
                  alt={`Foto ${selectedPhotoIndex + 1}`} 
                  className="photo-modal-image"
                />
              </div>
              
              <button 
                className="photo-modal-nav-btn next" 
                onClick={() => navigatePhoto('next')}
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className="photo-modal-info">
              <span className="photo-count">
                {selectedPhotoIndex + 1} / {formattedProfileData.fotos.length}
              </span>
              {formattedProfileData.fotos[selectedPhotoIndex].descripcion && (
                <p className="photo-description">
                  {formattedProfileData.fotos[selectedPhotoIndex].descripcion}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="perfil-content">
        {/* Profile Header Card - IG Style */}
        <div className="perfil-header-card">
          <div className="perfil-header-top">
            <div className="perfil-foto-container">
              <img 
                src={formattedProfileData.fotoPerfil} 
                alt={formattedProfileData.nombre} 
                className="perfil-foto"
              />
            </div>
            
            <div className="perfil-header-info">
              <div className="perfil-name-verification">
                <h1>{formattedProfileData.nombre}</h1>
                <div className="perfil-verification">
                  <FaCheckCircle className={formattedProfileData.verificado ? "verified-icon" : "unverified-icon"} />
                  <span>{formattedProfileData.verificado ? "Verificado" : "No Verificado"}</span>
                </div>
              </div>
              
              <div className="perfil-stats">
                <div className="perfil-stat-item">
                  <strong>{formattedProfileData.fotos.length}</strong>
                  <span>Fotos</span>
                </div>
                <div className="perfil-stat-item">
                  <strong>{formattedProfileData.servicios.length}</strong>
                  <span>Servicios</span>
                </div>
                <div className="perfil-stat-item">
                  <strong>{formattedProfileData.scoreActividad}</strong>
                  <span>Actividad</span>
                </div>
              </div>
              
              <div className="perfil-contact-buttons">
                <a
                  href={whatsappLink}
                  className="btn-contact whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp /> Contactar
                </a>
                
                {formattedProfileData.redes?.instagram && (
                  <a
                    href={`https://instagram.com/${formattedProfileData.redes.instagram}`}
                    className="btn-contact instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram /> Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="perfil-header-details">
            <div className="perfil-status-badges">
              {formattedProfileData.estaDisponible && (
                <span className="perfil-badge disponible">
                  <FaCheckCircle /> Disponible ahora
                </span>
              )}
              <span className="perfil-badge ubicacion">
                <FaMapMarkerAlt /> {formattedProfileData.ubicacion}
              </span>
              <span className="perfil-badge genero">
                <FaUser /> {formattedProfileData.genero}, {formattedProfileData.edad} años
              </span>
              <span className="perfil-badge tarifa">
                {formattedProfileData.tarifaBase}
              </span>
            </div>
            
            <div className="perfil-description">
              <p>{formattedProfileData.descripcion}</p>
            </div>
            
            <div className="perfil-quick-details">
              <div className="perfil-quick-detail">
                <span className="detail-label">Idiomas:</span>
                <span>{formattedProfileData.idiomas.join(', ')}</span>
              </div>
              
              <div className="perfil-quick-detail">
                <span className="detail-label">Disponibilidad:</span>
                <span>{formattedProfileData.disponibilidad}</span>
              </div>
              
              {formattedProfileData.altura !== "No especificado" && (
                <div className="perfil-quick-detail">
                  <span className="detail-label">Altura:</span>
                  <span>{formattedProfileData.altura} cm</span>
                </div>
              )}
              
              {formattedProfileData.peso !== "No especificado" && (
                <div className="perfil-quick-detail">
                  <span className="detail-label">Peso:</span>
                  <span>{formattedProfileData.peso} kg</span>
                </div>
              )}
            </div>
            
            <div className="perfil-tags">
              {formattedProfileData.servicios.length > 0 && (
                <div className="tag-group">
                  <h4 className="tag-group-title">Servicios:</h4>
                  <div className="tag-container">
                    {formattedProfileData.servicios.map((servicio, index) => (
                      <span key={index} className="perfil-tag service-tag">{servicio}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {formattedProfileData.categorias.length > 0 && (
                <div className="tag-group">
                  <h4 className="tag-group-title">Categorías:</h4>
                  <div className="tag-container">
                    {formattedProfileData.categorias.map((categoria, index) => (
                      <span key={index} className="perfil-tag category-tag">{categoria}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Photos Grid - Instagram Style */}
        <div className="perfil-gallery-header">
          <h2>Galería de Fotos</h2>
        </div>
        
        <div className="perfil-gallery">
          {formattedProfileData.fotos.length > 0 ? (
            formattedProfileData.fotos.map((foto, index) => (
              <div className="gallery-item" key={index} onClick={() => handlePhotoClick(index)}>
                <img src={foto.url} alt={`Foto ${index + 1}`} />
                {foto.esPrincipal && <span className="main-photo-badge">Principal</span>}
              </div>
            ))
          ) : (
            <p className="no-photos-message">No hay fotos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;