import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaGlobe, 
  FaInstagram, FaTwitter, FaFacebook, FaCheckCircle, FaPhoneAlt, FaWhatsapp, 
  FaEdit, FaSave, FaTimes, FaSpinner, FaInfoCircle, FaCloudUploadAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../estilos/PerfilAcompañante.css';
import '../estilos/Header.css';
import Header from './Header';
import defaultProfilePic from '../assets/publicacion.jpg';
import AuthService from './AuthService';

const PerfilAcompanantePropio = ({ setMenu= {} }) => {
  const [activeTab, setActiveTab] = useState('informacion');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  
  // Estado para mostrar modal para completar perfil
  const [showCompletarPerfilModal, setShowCompletarPerfilModal] = useState(false);

  // Usar useEffect para cargar los datos actuales del usuario logueado
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.tipoUsuario === 'acompanante' && !user.perfilCompleto) {
      setIsProfileIncomplete(true);
      setShowCompletarPerfilModal(true);
    }
  }, []);

  // Estado para los datos del perfil (predeterminados o del usuario actual)
  const defaultData = {
    id: currentUser?.perfilId || 0,
    nombre: currentUser?.nombre || "",
    ubicacion: "República Dominicana, Santo Domingo",
    fotoPerfil: defaultProfilePic,
    edad: 25,
    genero: "Femenino",
    descripcion: "Completa tu descripción para mejorar tu perfil.",
    telefono: "+1 000 000 0000",
    email: currentUser?.email || "",
    fechaRegistro: "Recientemente",
    servicios: ["Eventos sociales", "Cenas", "Viajes"],
    disponibilidad: "Lunes a Domingo",
    idiomas: ["Español"],
    tarifaBase: 100,
    moneda: "USD",
    categorias: ["Premium"],
    redes: {
      instagram: "",
      twitter: "",
      facebook: ""
    },
    publicaciones: [
      { 
        imagen: defaultProfilePic, 
        descripcion: "Completa tu perfil para añadir publicaciones." 
      }
    ],
    verificado: false,
    agenciaVerificadora: "",
    estaDisponible: true,
    altura: 170,
    peso: 60
  };

  // Obtener datos del perfil desde la API
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser || !currentUser.perfilId) {
        // Si no hay ID de perfil, usar datos predeterminados
        setProfileData(defaultData);
        setFormData(defaultData);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        const response = await fetch(`https://localhost:7134/api/Acompanantes/${currentUser.perfilId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar perfil (${response.status})`);
        }
        
        const data = await response.json();
        
        // Formatear datos del perfil
        const formattedData = {
          id: data.Id,
          nombre: data.NombrePerfil || defaultData.nombre,
          ubicacion: `${data.Pais || 'República Dominicana'}, ${data.Ciudad || 'Santo Domingo'}`,
          fotoPerfil: data.FotoPrincipal 
            ? `https://localhost:7134${data.FotoPrincipal}`
            : data.Fotos && data.Fotos.length > 0 
              ? `https://localhost:7134${data.Fotos[0].Url}`
              : defaultProfilePic,
          edad: data.Edad || defaultData.edad,
          genero: data.Genero || defaultData.genero,
          descripcion: data.Descripcion || defaultData.descripcion,
          telefono: data.Whatsapp || defaultData.telefono,
          email: data.Email || currentUser.email || defaultData.email,
          fechaRegistro: "Miembro desde " + new Date().toLocaleDateString(),
          servicios: data.Servicios?.map(s => s.Nombre) || defaultData.servicios,
          disponibilidad: data.Disponibilidad || defaultData.disponibilidad,
          idiomas: data.Idiomas?.split(',').map(i => i.trim()) || defaultData.idiomas,
          tarifaBase: data.TarifaBase || defaultData.tarifaBase,
          moneda: data.Moneda || defaultData.moneda,
          categorias: data.Categorias?.map(c => c.Nombre) || defaultData.categorias,
          redes: {
            instagram: data.Instagram || '',
            twitter: '',
            facebook: ''
          },
          publicaciones: data.Fotos?.map((foto, index) => ({
            imagen: `https://localhost:7134${foto.Url}`,
            descripcion: foto.Descripcion || `Publicación ${index + 1}`
          })) || defaultData.publicaciones,
          verificado: data.EstaVerificado || false,
          agenciaVerificadora: data.NombreAgencia || '',
          estaDisponible: data.EstaDisponible !== undefined ? data.EstaDisponible : true,
          altura: data.Altura || defaultData.altura,
          peso: data.Peso || defaultData.peso
        };
        
        setProfileData(formattedData);
        setFormData(formattedData);
        
        // Actualizar el estado de perfil completo
        setIsProfileIncomplete(!data.PerfilCompleto);
        
        // Si el usuario completó su perfil, actualizar en localStorage
        if (data.PerfilCompleto && currentUser) {
          const updatedUser = { ...currentUser, perfilCompleto: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
        setProfileData(defaultData);
        setFormData(defaultData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleServiciosChange = (e) => {
    const serviciosText = e.target.value;
    const serviciosArray = serviciosText.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, servicios: serviciosArray }));
  };
  
  const handleIdiomasChange = (e) => {
    const idiomasText = e.target.value;
    const idiomasArray = idiomasText.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, idiomas: idiomasArray }));
  };
  
  const handleCategoriasChange = (e) => {
    const categoriasText = e.target.value;
    const categoriasArray = categoriasText.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, categorias: categoriasArray }));
  };

  const handleRedesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      redes: { ...prev.redes, [name]: value } 
    }));
  };
  
  const handleDisponibilidadChange = (e) => {
    setFormData(prev => ({ ...prev, estaDisponible: e.target.checked }));
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo y tamaño de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setErrorMessage('El archivo debe ser una imagen (JPG, JPEG o PNG)');
      return;
    }
    
    if (file.size > maxSize) {
      setErrorMessage('La imagen no debe exceder los 5MB');
      return;
    }
    
    try {
      setPhotoUploading(true);
      
      // Crear una URL temporal para vista previa
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, fotoPerfil: previewUrl }));
      
      // Subir la foto al servidor
      const formData = new FormData();
      formData.append('file', file);
      formData.append('esPrincipal', 'true');
      
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`https://localhost:7134/api/Acompanantes/${currentUser.perfilId}/foto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir foto (${response.status})`);
      }
      
      setSuccessMessage('Foto subida correctamente');
      
      // Actualizar la imagen en el perfil
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error al subir foto:', error);
      setErrorMessage('Error al subir la foto: ' + error.message);
      
      // Revertir a la foto anterior
      setFormData(prev => ({ ...prev, fotoPerfil: profileData.fotoPerfil }));
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      // Validar campos obligatorios
      if (!formData.nombre || !formData.descripcion || !formData.telefono) {
        setErrorMessage('Por favor complete los campos obligatorios: Nombre, Descripción y Teléfono');
        setIsSubmitting(false);
        return;
      }
      
      // Validar teléfono
      const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
      if (!phoneRegex.test(formData.telefono)) {
        setErrorMessage('Ingrese un número de teléfono válido');
        setIsSubmitting(false);
        return;
      }
      
      // Preparar datos para enviar al servidor
      const updatedProfileData = {
        Id: currentUser.perfilId,
        NombrePerfil: formData.nombre,
        Descripcion: formData.descripcion,
        Whatsapp: formData.telefono,
        EstaDisponible: formData.estaDisponible,
        Disponibilidad: formData.disponibilidad,
        TarifaBase: parseFloat(formData.tarifaBase),
        Moneda: formData.moneda,
        Altura: parseInt(formData.altura) || 170,
        Peso: parseInt(formData.peso) || 60,
        Edad: parseInt(formData.edad) || 25,
        Genero: formData.genero,
        Idiomas: formData.idiomas.join(', '),
        Instagram: formData.redes.instagram,
        // Extrar país y ciudad de la ubicación
        Pais: formData.ubicacion.split(',')[0].trim(),
        Ciudad: formData.ubicacion.split(',').length > 1 ? formData.ubicacion.split(',')[1].trim() : '',
        PerfilCompleto: true // Marcar como perfil completo
      };
      
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`https://localhost:7134/api/Acompanantes/${currentUser.perfilId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfileData)
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar perfil (${response.status})`);
      }
      
      // Actualizar estado de perfil completo
      if (isProfileIncomplete) {
        setIsProfileIncomplete(false);
        
        // Actualizar datos del usuario en localStorage
        if (currentUser) {
          const updatedUser = { ...currentUser, perfilCompleto: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
      }
      
      // Actualizar el perfil en el estado
      setProfileData(formData);
      setSuccessMessage('Perfil actualizado correctamente');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Desactivar modo edición
      setIsEditing(false);
      setShowCompletarPerfilModal(false);
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrorMessage('Error al actualizar el perfil: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    // Restaurar datos originales
    setFormData(profileData);
    setIsEditing(false);
    setErrorMessage(null);
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <Header onNavigate={setMenu} userLoggedIn={true} handleLogout={() => {}} />
        <div className="perfil-content">
          <div className="loading-indicator">
            <FaSpinner className="spinner" /> Cargando perfil...
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="perfil-container">
        <Header onNavigate={setMenu} userLoggedIn={true} handleLogout={() => {}} />
        <div className="perfil-content">
          <div className="loading-indicator">
            <FaInfoCircle /> No se pudo cargar el perfil.
          </div>
        </div>
      </div>
    );
  }

  const whatsappNumber = formData.telefono ? formData.telefono.replace(/\D/g, '') : '';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Modal de completar perfil
  const renderCompletarPerfilModal = () => {
    if (!showCompletarPerfilModal) return null;
    
    return (
      <div className="photo-modal-overlay">
        <div className="photo-modal-content" style={{
          background: '#242424',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '600px',
          width: '95%'
        }}>
          <button 
            className="photo-modal-close"
            onClick={() => setShowCompletarPerfilModal(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <FaTimes style={{ color: 'white' }} />
          </button>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <FaExclamationTriangle style={{ color: '#fd5e53', fontSize: '2rem', marginBottom: '10px' }} />
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>
              Perfil Incompleto
            </h3>
            <p style={{ color: '#b0b0b0', marginBottom: '20px' }}>
              Para aumentar tu visibilidad y permitir que los clientes te encuentren, necesitas completar tu perfil con la información básica.
            </p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                Nombre de Perfil*
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #303030',
                  borderRadius: '5px',
                  color: 'white'
                }}
                placeholder="Tu nombre de perfil"
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                Descripción*
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #303030',
                  borderRadius: '5px',
                  color: 'white',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Escribe una descripción atractiva sobre ti y tus servicios"
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                Teléfono / WhatsApp*
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #303030',
                  borderRadius: '5px',
                  color: 'white'
                }}
                placeholder="+1 000 000 0000"
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                Foto de Perfil
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img 
                  src={formData.fotoPerfil} 
                  alt="Foto de perfil" 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #fd5e53'
                  }}
                />
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 15px',
                  backgroundColor: '#fd5e53',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  <FaCloudUploadAlt /> Subir Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.estaDisponible}
                  onChange={handleDisponibilidadChange}
                />
                Disponible actualmente
              </label>
            </div>
          </div>
          
          {errorMessage && (
            <div style={{
              padding: '10px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid #ff4444',
              borderRadius: '5px',
              color: '#ff4444',
              marginBottom: '15px'
            }}>
              {errorMessage}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={() => setShowCompletarPerfilModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #505050',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Completaré después
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#fd5e53',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" /> Guardando...
                </>
              ) : (
                <>
                  <FaSave /> Guardar Perfil
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="perfil-container">
      <Header onNavigate={setMenu} userLoggedIn={true} handleLogout={() => {}} />
      
      {/* Modal para completar perfil */}
      {renderCompletarPerfilModal()}
      
      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'rgba(0, 199, 85, 0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          animation: 'fadeInRight 0.3s'
        }}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && !showCompletarPerfilModal && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'rgba(255, 68, 68, 0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          animation: 'fadeInRight 0.3s'
        }}>
          {errorMessage}
        </div>
      )}
      
      {/* Alerta de perfil incompleto si no se muestra el modal */}
      {isProfileIncomplete && !showCompletarPerfilModal && (
        <div style={{
          margin: '20px auto',
          maxWidth: '800px',
          padding: '15px',
          backgroundColor: 'rgba(255, 94, 83, 0.1)',
          border: '1px solid rgba(255, 94, 83, 0.3)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaExclamationTriangle style={{ color: '#fd5e53', fontSize: '1.5rem' }} />
            <div>
              <h3 style={{ color: 'white', marginBottom: '5px' }}>
                Completa tu perfil
              </h3>
              <p style={{ color: '#b0b0b0' }}>
                Tu perfil está incompleto. Completa la información para ser más visible en la plataforma.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCompletarPerfilModal(true)}
            style={{
              padding: '8px 15px',
              backgroundColor: '#fd5e53',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Completar Ahora
          </button>
        </div>
      )}
      
      <div className="perfil-content">
        <div className="perfil-header-card">
          <div className="perfil-header-top">
            <div className="perfil-foto-container">
              <img 
                src={formData.fotoPerfil} 
                alt={formData.nombre} 
                className="perfil-foto"
              />
              {isEditing && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <label style={{
                    display: 'inline-block',
                    padding: '8px 15px',
                    backgroundColor: 'rgba(255, 94, 83, 0.9)',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                    <FaCloudUploadAlt /> {photoUploading ? 'Subiendo...' : 'Cambiar Foto'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={photoUploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <div className="perfil-header-info">
              <div className="perfil-name-verification">
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '5px',
                      padding: '8px',
                      width: '100%',
                      marginBottom: '10px'
                    }}
                  />
                ) : (
                  <h1>{formData.nombre}</h1>
                )}
                <div className="perfil-verification">
                  <FaCheckCircle className={formData.verificado ? "verified-icon" : "unverified-icon"} />
                  <span>{formData.verificado ? "Verificado" : "No Verificado"}</span>
                </div>
              </div>
              
              <div className="perfil-stats">
                <div className="perfil-stat-item">
                  <strong>{formData.publicaciones.length}</strong>
                  <span>Fotos</span>
                </div>
                <div className="perfil-stat-item">
                  <strong>{formData.servicios.length}</strong>
                  <span>Servicios</span>
                </div>
                <div className="perfil-stat-item">
                  <strong>
                    {isEditing ? (
                      <input
                        type="number"
                        name="tarifaBase"
                        value={formData.tarifaBase}
                        onChange={handleInputChange}
                        style={{
                          width: '70px',
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '5px',
                          padding: '5px',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      />
                    ) : (
                      formData.tarifaBase
                    )}
                  </strong>
                  <span>
                    {isEditing ? (
                      <select
                        name="moneda"
                        value={formData.moneda}
                        onChange={handleInputChange}
                        style={{
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '5px',
                          padding: '5px',
                          color: 'white',
                          width: '70px'
                        }}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="DOP">DOP</option>
                      </select>
                    ) : (
                      formData.moneda
                    )}
                  </span>
                </div>
              </div>
              
              <div className="perfil-contact-buttons">
                {!isEditing && (
                  <>
                    <a
                      href={whatsappLink}
                      className="btn-contact whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp /> Ver Mi WhatsApp
                    </a>
                    
                    {formData.redes?.instagram && (
                      <a
                        href={`https://instagram.com/${formData.redes.instagram}`}
                        className="btn-contact instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaInstagram /> Instagram
                      </a>
                    )}
                  </>
                )}
                
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', width: '100%' }}>
                    <button
                      onClick={cancelEdit}
                      style={{
                        flex: '1',
                        padding: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        color: 'white',
                        border: '1px solid #505050',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <FaTimes /> Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      style={{
                        flex: '1',
                        padding: '10px',
                        backgroundColor: '#fd5e53',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="spinner" /> Guardando...
                        </>
                      ) : (
                        <>
                          <FaSave /> Guardar
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      marginTop: '10px',
                      padding: '10px 20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaEdit /> Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="perfil-header-details">
            <div className="perfil-status-badges">
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {isEditing ? (
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    padding: '5px 10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.estaDisponible}
                      onChange={handleDisponibilidadChange}
                    />
                    {formData.estaDisponible ? "Disponible ahora" : "No disponible"}
                  </label>
                ) : (
                  formData.estaDisponible && (
                    <span className="perfil-badge disponible">
                      <FaCheckCircle /> Disponible ahora
                    </span>
                  )
                )}
              </div>
              <span className="perfil-badge ubicacion">
                <FaMapMarkerAlt /> 
                {isEditing ? (
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      width: '150px'
                    }}
                  />
                ) : (
                  formData.ubicacion
                )}
              </span>
              <span className="perfil-badge genero">
                <FaUser /> 
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleInputChange}
                      min="18"
                      max="99"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        width: '40px'
                      }}
                    /> años
                  </div>
                ) : (
                  `${formData.genero}, ${formData.edad} años`
                )}
              </span>
              <span className="perfil-badge tarifa">
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="number"
                      name="tarifaBase"
                      value={formData.tarifaBase}
                      onChange={handleInputChange}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        width: '60px'
                      }}
                    />
                    <select
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="DOP">DOP</option>
                    </select>
                  </div>
                ) : (
                  `${formData.tarifaBase} ${formData.moneda}`
                )}
              </span>
            </div>
            
            <div className="perfil-description">
              {isEditing ? (
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '5px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                  placeholder="Escribe una descripción atractiva sobre ti y tus servicios"
                />
              ) : (
                <p>{formData.descripcion}</p>
              )}
            </div>
            
            <div className="perfil-quick-details">
              <div className="perfil-quick-detail">
                <span className="detail-label">Idiomas:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.idiomas.join(', ')}
                    onChange={handleIdiomasChange}
                    placeholder="Español, Inglés, etc. (separados por comas)"
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '5px',
                      padding: '5px',
                      color: 'white',
                      width: '100%'
                    }}
                  />
                ) : (
                  <span>{formData.idiomas.join(', ')}</span>
                )}
              </div>
              
              <div className="perfil-quick-detail">
                <span className="detail-label">Disponibilidad:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="disponibilidad"
                    value={formData.disponibilidad}
                    onChange={handleInputChange}
                    placeholder="Lunes a Viernes: 9am - 8pm, etc."
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '5px',
                      padding: '5px',
                      color: 'white',
                      width: '100%'
                    }}
                  />
                ) : (
                  <span>{formData.disponibilidad}</span>
                )}
              </div>
              
              <div className="perfil-quick-detail">
                <span className="detail-label">Altura:</span>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="number"
                      name="altura"
                      value={formData.altura}
                      onChange={handleInputChange}
                      min="140"
                      max="210"
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '5px',
                        padding: '5px',
                        color: 'white',
                        width: '60px'
                      }}
                    /> cm
                  </div>
                ) : (
                  <span>{formData.altura} cm</span>
                )}
              </div>
              
              <div className="perfil-quick-detail">
                <span className="detail-label">Peso:</span>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="number"
                      name="peso"
                      value={formData.peso}
                      onChange={handleInputChange}
                      min="40"
                      max="150"
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '5px',
                        padding: '5px',
                        color: 'white',
                        width: '60px'
                      }}
                    /> kg
                  </div>
                ) : (
                  <span>{formData.peso} kg</span>
                )}
              </div>
            </div>
            
            <div className="perfil-tags">
              <div className="tag-group">
                <h4 className="tag-group-title">Servicios:</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.servicios.join(', ')}
                    onChange={handleServiciosChange}
                    placeholder="Eventos, Cenas, Viajes, etc. (separados por comas)"
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '5px',
                      color: 'white'
                    }}
                  />
                ) : (
                  <div className="tag-container">
                    {formData.servicios.map((servicio, index) => (
                      <span key={index} className="perfil-tag service-tag">{servicio}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="tag-group">
                <h4 className="tag-group-title">Categorías:</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.categorias.join(', ')}
                    onChange={handleCategoriasChange}
                    placeholder="Premium, VIP, etc. (separados por comas)"
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '5px',
                      color: 'white'
                    }}
                  />
                ) : (
                  <div className="tag-container">
                    {formData.categorias.map((categoria, index) => (
                      <span key={index} className="perfil-tag category-tag">{categoria}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="tag-group">
                <h4 className="tag-group-title">Redes Sociales:</h4>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaInstagram style={{ color: '#E1306C' }} />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.redes.instagram}
                        onChange={handleRedesChange}
                        placeholder="Usuario de Instagram"
                        style={{
                          padding: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '5px',
                          color: 'white',
                          width: '200px'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="perfil-redes-sociales">
                    {formData.redes?.instagram && (
                      <a href={`https://instagram.com/${formData.redes.instagram}`} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="red-social-icon instagram" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="perfil-tabs">
          <button
            className={`perfil-tab ${activeTab === 'publicaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('publicaciones')}
          >
            Mis Fotos
          </button>
          <button
            className={`perfil-tab ${activeTab === 'informacion' ? 'active' : ''}`}
            onClick={() => setActiveTab('informacion')}
          >
            Información
          </button>
        </div>
        
        <div className="perfil-tab-content">
          {activeTab === 'publicaciones' && (
            <div className="perfil-gallery">
              {formData.publicaciones && formData.publicaciones.length > 0 ? (
                formData.publicaciones.map((publicacion, index) => (
                  <div className="gallery-item" key={index}>
                    <img src={publicacion.imagen} alt={`Publicación ${index + 1}`} />
                    {index === 0 && <span className="main-photo-badge">Principal</span>}
                  </div>
                ))
              ) : (
                <div className="no-photos-message">
                  <p>No tienes fotos en tu galería.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      backgroundColor: '#fd5e53',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Agregar Fotos
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'informacion' && (
            <div className="perfil-seccion perfil-contacto">
              <h3>Información de Contacto</h3>
              <div className="perfil-contacto-info">
                {isEditing ? (
                  <>
                    <div className="perfil-contacto-item">
                      <FaEnvelope className="perfil-contacto-icon" />
                      <input
                        type="email"
                        value={currentUser?.email || ""}
                        disabled
                        style={{
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '5px',
                          padding: '8px',
                          color: '#888',
                          width: '100%'
                        }}
                      />
                    </div>
                    <div className="perfil-contacto-item">
                      <FaPhone className="perfil-contacto-icon" />
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="+1 000 000 0000"
                        style={{
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '5px',
                          padding: '8px',
                          color: 'white',
                          width: '100%'
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="perfil-contacto-item">
                      <FaEnvelope className="perfil-contacto-icon" />
                      <span>{currentUser?.email || formData.email}</span>
                    </div>
                    <div className="perfil-contacto-item">
                      <FaPhone className="perfil-contacto-icon" />
                      <span>{formData.telefono}</span>
                    </div>
                  </>
                )}
                <div className="perfil-contacto-item">
                  <FaCalendarAlt className="perfil-contacto-icon" />
                  <span>{formData.fechaRegistro}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilAcompanantePropio;