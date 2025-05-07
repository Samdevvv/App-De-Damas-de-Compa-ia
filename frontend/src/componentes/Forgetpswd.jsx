import { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../estilos/forgetpsw.css";
import loginImage from "../assets/logo png.png";

const ForgetPsw = ({ setMenu }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación básica de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError({
        title: "Error de Validación",
        message: "Por favor, ingrese un correo electrónico válido."
      });
      setLoading(false);
      return;
    }

    try {
      // Simular una llamada a API (en producción usarías fetch real)
      // const response = await fetch("https://localhost:7134/api/users/resetpassword", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: email.trim() }),
      // });

      // Simulamos éxito para demostración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setError({
        title: "Solicitud Enviada",
        message: "Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada."
      });
    } catch (error) {
      // Ahora utilizamos el parámetro 'error' en lugar de 'err'
      console.error("Error al enviar la solicitud:", error);
      setError({
        title: "Error",
        message: "No se pudo enviar el enlace de recuperación. Por favor, intenta de nuevo más tarde." 
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (success) {
      setMenu("login");
    }
    setError(null);
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-right">
        <div className="forget-password-form">
          {/* Lado izquierdo con logo y mensaje */}
          <div className="forget-password-left">
            <button
              className="forget-password-back-button"
              onClick={() => setMenu("mainpage")}
              type="button"
              aria-label="Volver"
            >
              <FaArrowLeft size={16} />
            </button>
            
            <img src={loginImage} alt="Telo Fundi" className="forget-password-title-image" />
            
            <div className="forget-password-welcome">
              <h2>¿Olvidaste tu contraseña?</h2>
              <p>No te preocupes. Te enviaremos un enlace para restablecer tu contraseña.</p>
            </div>
            
            {/* Formas decorativas */}
            <div className="forget-password-shape forget-password-shape-1"></div>
            <div className="forget-password-shape forget-password-shape-2"></div>
            <div className="forget-password-shape forget-password-shape-3"></div>
          </div>
          
          {/* Lado derecho con formulario */}
          <div className="forget-password-right-form">
            <div className="forget-password-form-title">
              <h2>Recuperar Contraseña</h2>
              <p>Ingresa tu correo electrónico para recibir instrucciones</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="forget-password-input-box">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`form-control ${email ? "filled" : ""}`}
                  disabled={loading}
                />
                <label>Correo Electrónico</label>
                <FaEnvelope className="input-icon" />
              </div>

              <div className="forget-password-button-container">
                <button
                  type="submit"
                  className="forget-password-button"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Enlace"}
                </button>
              </div>

              <div className="forget-password-footer">
                ¿Ya recordaste tu contraseña?
                <button type="button" onClick={() => setMenu("login")}>
                  Inicia Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
        

        {error && (
          <div className="registro-modal">
            <div className="registro-modal-content">
              <h3>{error.title}</h3>
              <p>{error.message}</p>
              <div className="registro-modal-buttons">
                <button onClick={closeModal} className="registro-modal-button">
                  {success ? "Ir a Login" : "Cerrar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPsw;