import React from 'react';
import '../estilos/Terminos.css';
import logoImage from '../assets/logo png.png';
import Header from './Header';

const Terminos = ({ setMenu, userLoggedIn, handleLogout }) => {
  return (
    <div className="page-container">
      {/* Header con logo flotante */}
      <Header onNavigate={setMenu} userLoggedIn={userLoggedIn} handleLogout={handleLogout} />

      {/* Terms and Conditions Section */}
      <section className="terms-section">
        <div className="container">
          <div className="terms-header">
            <img src={logoImage} alt="Telo Fundi Logo" className="terms-logo" />
            <h1>Términos y Condiciones</h1>
          </div>
          <div className="terms-content">
            <p className="terms-intro">
              Bienvenido a Telo Fundi, la plataforma líder para conectar con acompañantes en la República Dominicana. Al utilizar nuestra aplicación, aceptas los siguientes términos y condiciones. Por favor, léelos cuidadosamente.
            </p>

            <div className="terms-section-item">
              <h2>1. Aceptación de los Términos</h2>
              <p>
                Al acceder o utilizar Telo Fundi, aceptas estar sujeto a estos Términos y Condiciones, así como a nuestra Política de Privacidad. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestra plataforma.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>2. Naturaleza del Servicio</h2>
              <p>
                Telo Fundi es una plataforma que facilita la conexión entre usuarios y acompañantes. No somos una agencia de acompañantes ni participamos directamente en las interacciones entre usuarios y acompañantes. Nuestra función se limita a proporcionar una plataforma para publicidad y comunicación.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>3. Responsabilidad de las Interacciones</h2>
              <p>
                Telo Fundi no se hace responsable de las conversaciones, acuerdos, o cualquier actividad que ocurra fuera de nuestra plataforma. Todas las interacciones entre usuarios y acompañantes son responsabilidad exclusiva de las partes involucradas. Recomendamos a los usuarios actuar con precaución y verificar la identidad de las personas con las que interactúan.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>4. Edad Mínima</h2>
              <p>
                Nuestra plataforma está destinada exclusivamente a personas mayores de 18 años. Al usar Telo Fundi, confirmas que tienes al menos 18 años de edad. Nos reservamos el derecho de suspender o eliminar cuentas de usuarios que no cumplan con este requisito.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>5. Contenido Prohibido</h2>
              <p>
                Los usuarios no deben publicar contenido ilegal, ofensivo, o que infrinja los derechos de terceros. Esto incluye, pero no se limita a, contenido que promueva la violencia, la discriminación, o actividades ilícitas. Telo Fundi se reserva el derecho de eliminar cualquier contenido que viole estas normas.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>6. Limitación de Responsabilidad</h2>
              <p>
                Telo Fundi no será responsable por ningún daño directo, indirecto, incidental, especial, o consecuente derivado del uso de nuestra plataforma o de las interacciones fuera de ella. Esto incluye, pero no se limita a, pérdidas financieras, daños personales, o disputas entre usuarios.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>7. Modificaciones a los Términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor al momento de su publicación en la plataforma. Es tu responsabilidad revisar periódicamente los términos actualizados.
              </p>
            </div>

            <div className="terms-section-item">
              <h2>8. Contacto</h2>
              <p>
                Si tienes preguntas o inquietudes sobre estos Términos y Condiciones, puedes contactarnos a través de nuestro formulario de contacto en la plataforma o enviando un correo electrónico a soporte@telofundi.com.
              </p>
            </div>

            <p className="terms-footer">
              Última actualización: 4 de mayo de 2025
            </p>
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
                  <li><a href="#">Estadísticas</a></li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Información</h4>
                <ul>
                  <li><a href="#" onClick={() => setMenu('terminos')}>Términos y Condiciones</a></li>
                  <li><a href="#">Política de Privacidad</a></li>
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

export default Terminos;