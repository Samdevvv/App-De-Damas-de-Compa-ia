import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Perfil from './PerfilAcompañante'; // Ensure this path is correct
import { FaWhatsapp, FaSearch, FaCheckCircle, FaMapMarkerAlt, FaTimes, FaGlobe, FaCalendarAlt, FaUser } from 'react-icons/fa';

// URL base de la API
const API_BASE_URL = 'https://localhost:7134/api/Acompanantes';

const Homepage = ({ setMenu, userLoggedIn, handleLogout }) => {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showProfileComponent, setShowProfileComponent] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log("Profile component visibility:", showProfileComponent);
    console.log("Selected profile ID:", selectedProfileId);
    console.log("Profile data exists:", !!profileData);
  }, [showProfileComponent, selectedProfileId, profileData]);

  // Age verification modal
  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (!ageVerified) {
      setShowAgeModal(true);
    }
  }, []);

  useEffect(() => {
    if (showAgeModal || showFiltersModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAgeModal, showFiltersModal]);

  // Fetch profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/Paginado`, {
          params: {
            pageNumber: 1,
            pageSize: 10,
          },
        });
        console.log('API response (Paginado):', response.data);
        const fetchedProfiles = response.data.Items.map((item) => ({
          id: item.Id,
          name: item.NombrePerfil,
          age: item.Edad || 'No especificado',
          city: item.Ciudad || 'No especificado',
          country: item.Pais || 'No especificado',
          price: item.TarifaBase ? item.TarifaBase.toFixed(2) : 'N/A',
          description: item.Descripcion || 'Sin descripción',
          image: item.FotoPrincipal
            ? `${API_BASE_URL.replace('/api/Acompanantes', '')}${item.FotoPrincipal}`
            : item.Fotos.find((foto) => foto.EsPrincipal)?.Url
            ? `${API_BASE_URL.replace('/api/Acompanantes', '')}${item.Fotos.find((foto) => foto.EsPrincipal).Url}`
            : item.Fotos[0]?.Url
            ? `${API_BASE_URL.replace('/api/Acompanantes', '')}${item.Fotos[0].Url}`
            : 'https://via.placeholder.com/280x373',
          verified: item.EstaVerificado || false,
          whatsapp: item.Whatsapp || '+1-000-000-0000',
          services: item.Servicios.map((servicio) => servicio.Nombre || 'Servicio'),
          moneda: item.Moneda || 'USD',
          // Added new fields
          genero: item.Genero || 'No especificado',
          disponible: item.EstaDisponible || false,
          horario: item.Disponibilidad || 'No especificado',
          idiomas: item.Idiomas || 'No especificado',
          categorias: item.Categorias?.map((categoria) => categoria.Nombre) || []
        }));
        setProfiles(fetchedProfiles);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.Message || err.message}`
          : `Error de red: ${err.message}`;
        setError(`No se pudieron cargar los perfiles. ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Modified fetch profile details with improved error handling and visibility toggle
  const fetchProfileDetails = async (id) => {
    if (profileLoading) return;
    try {
      setProfileLoading(true);
      setError(null); // Clear any previous errors
      
      console.log(`Fetching profile details for ID: ${id}`);
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      
      if (!response.data) {
        throw new Error('Respuesta vacía del servidor');
      }
      
      // Set profile data
      setProfileData(response.data);
      // Set ID
      setSelectedProfileId(id);
      
      console.log("Profile data fetched successfully:", response.data);
      
      // Show profile component AFTER data is loaded
      setTimeout(() => {
        setShowProfileComponent(true);
      }, 100);
      
    } catch (err) {
      console.error(`Error fetching profile details for id ${id}:`, err);
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${err.response.data?.Message || err.message}`
        : `Error de red: ${err.message}`;
      setError(`No se pudieron cargar los detalles del perfil. ${errorMessage}`);
      
      // Reset states on error
      setSelectedProfileId(null);
      setProfileData(null);
      setShowProfileComponent(false);
    } finally {
      setProfileLoading(false);
    }
  };

  // Improved back to home function
  const backToHome = () => {
    console.log("Returning to homepage");
    setShowProfileComponent(false);
    
    // Use setTimeout to ensure React has time to process state change
    setTimeout(() => {
      setSelectedProfileId(null);
      setProfileData(null);
    }, 100);
  };

  const handleAgeAccept = () => {
    localStorage.setItem('ageVerified', 'true');
    setShowAgeModal(false);
  };

  const handleAgeCancel = () => {
    window.location.href = 'https://google.com';
  };

  const openFiltersModal = () => {
    setShowFiltersModal(true);
  };

  const closeFiltersModal = () => {
    setShowFiltersModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Improved conditional rendering with explicit visibility control
  if (showProfileComponent && profileData) {
    console.log("Rendering profile component");
    return (
      <Perfil 
        profileData={profileData} 
        onBackClick={backToHome} 
      />
    );
  }

  return (
    <div className="page-container">
      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="age-modal-overlay">
          <div className="age-modal">
            <h3 className="modal-title">¿Eres mayor de 18?</h3>
            <p className="modal-text">Debes tener 18 años o más para entrar.</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-primary" onClick={handleAgeAccept}>
                Sí, entrar
              </button>
              <button className="modal-btn modal-btn-secondary" onClick={handleAgeCancel}>
                No, salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="header-section">
        <Header onNavigate={setMenu} userLoggedIn={userLoggedIn} handleLogout={handleLogout} />
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por ubicación o servicios..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="search-button" onClick={openFiltersModal}>
                <FaSearch size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Modal */}
      {showFiltersModal && (
        <div className="modal-overlay" onClick={closeFiltersModal}>
          <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Búsqueda avanzada</h3>
              <button className="close-modal" onClick={closeFiltersModal}>
                <FaTimes size={24} />
              </button>
            </div>
            <div className="filters-container-modal">
              <div className="filter-group">
                <label>Filtro</label>
                <select className="filter-select">
                  <option value="todos">Todos</option>
                  <option value="verificados">Verificados</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Ubicación</label>
                <select className="filter-select">
                  <option value="">Todas las ubicaciones</option>
                  <option value="santodomingo">Santo Domingo</option>
                  <option value="santiago">Santiago</option>
                  <option value="puntacana">Punta Cana</option>
                  <option value="laromana">La Romana</option>
                  <option value="puertoplata">Puerto Plata</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Servicio</label>
                <select className="filter-select">
                  <option value="">Todos los servicios</option>
                  <option value="masajes">Masajes</option>
                  <option value="escorts">Escorts</option>
                  <option value="compania">Compañía</option>
                  <option value="eventos">Eventos</option>
                  <option value="viajes">Viajes</option>
                </select>
              </div>
              <button className="apply-filters" onClick={closeFiltersModal}>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Section */}
      <section className="profiles-section">
        <div className="container">
          {loading && <p>Cargando perfiles...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && profiles.length === 0 && <p>No se encontraron perfiles.</p>}
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div key={profile.id} className="profile-card">
                <div className="profile-image-container">
                  <img src={profile.image} alt={profile.name} className="profile-image" />
                  <div className="profile-overlay"></div>
                </div>
                <div className="profile-info">
                  <div className="profile-header">
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-age">{profile.age}</span>
                  </div>
                  <div className="verification-badges">
                    {profile.verified && (
                      <div className="badge verified">
                        <FaCheckCircle size={12} /> Verificado
                      </div>
                    )}
                    {profile.disponible && (
                      <div className="badge disponible">
                        <FaCheckCircle size={12} /> Disponible
                      </div>
                    )}
                  </div>
                  <div className="profile-details">
                    <div className="profile-location">
                      <FaMapMarkerAlt size={12} />
                      {profile.city}
                    </div>
                    <div className="profile-country">
                      <FaMapMarkerAlt size={12} />
                      {profile.country}
                    </div>
                    <div className="profile-price">
                      {profile.price} {profile.moneda}
                    </div>
                  </div>
                  
                  {/* Additional details section */}
                  <div className="profile-extra-details">
                    <div className="profile-extra-item">
                      <FaUser size={12} />
                      <span>{profile.genero}</span>
                    </div>
                    <div className="profile-extra-item">
                      <FaCalendarAlt size={12} />
                      <span>{profile.horario}</span>
                    </div>
                    <div className="profile-extra-item">
                      <FaGlobe size={12} />
                      <span>{profile.idiomas}</span>
                    </div>
                  </div>
                  
                  <div className="profile-description">{profile.description}</div>
                  
                  <div className="profile-services">
                    <div className="service-group">
                      <h4 className="service-group-title">Servicios:</h4>
                      <div className="service-tags">
                        {profile.services.map((service, index) => (
                          <span key={index} className="service-tag">{service}</span>
                        ))}
                      </div>
                    </div>
                    
                    {profile.categorias.length > 0 && (
                      <div className="service-group">
                        <h4 className="service-group-title">Categorías:</h4>
                        <div className="service-tags">
                          {profile.categorias.map((categoria, index) => (
                            <span key={index} className="service-tag category-tag">{categoria}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="profile-actions">
                    <a
                      href={`https://wa.me/${profile.whatsapp}`}
                      className="action-btn whatsapp-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp size={16} /> Contactar por WhatsApp
                    </a>
                    <button
                      className="action-btn view-profile-btn"
                      onClick={() => fetchProfileDetails(profile.id)}
                      disabled={profileLoading}
                    >
                      {profileLoading ? 'Cargando...' : 'Ver Perfil'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <nav className="footer-nav">
            <a href="/privacidad" className="footer-link">Privacidad</a>
            <a href="/terminos" className="footer-link">Términos</a>
            <a href="/ayuda" className="footer-link">Ayuda</a>
            <a href="/contacto" className="footer-link">Contacto</a>
          </nav>
          <div className="footer-bottom">
            <p>© 2025 Telo Fundi</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;