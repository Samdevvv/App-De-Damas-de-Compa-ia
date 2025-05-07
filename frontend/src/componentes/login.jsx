import { useState, useEffect } from "react";
import "../estilos/login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import loginImage from "../assets/logo png.png";

const Login = ({ setMenu, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [ setAnimated] = useState(false);

  useEffect(() => {
    // Activar animación después de un breve retraso
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const forbiddenChars = /['";#=/*\\%&_|^<>()[\]-]/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    if (forbiddenChars.test(value)) {
      setError({
        title: "Caracteres no permitidos",
        message: "El correo contiene caracteres no admitidos.",
      });
      const filteredValue = value.replace(forbiddenChars, "");
      setEmail(filteredValue);
    } else {
      setEmail(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (forbiddenChars.test(value)) {
      setError({
        title: "Caracteres no permitidos",
        message: "La contraseña contiene caracteres no admitidos.",
      });
      const filteredValue = value.replace(forbiddenChars, "");
      setPassword(filteredValue);
    } else {
      setPassword(value);
    }
  };

  useEffect(() => {
    if (error && error.title === "Caracteres no permitidos") {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePasswordKeyUp = (e) =>
    setIsCapsLockOn(e.getModifierState("CapsLock"));
  const handlePasswordBlur = () => setIsCapsLockOn(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleRememberMeChange = (e) => setRememberMe(e.target.checked);

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return "Por favor, ingrese un correo electrónico válido.";
    }
    if (!password || password.trim().length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError({
        title: "Error de Validación",
        message: validationError,
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        Email: email.trim(),
        Password: password.trim(),
        RememberMe: rememberMe
      };

      const response = await fetch("https://localhost:7134/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error(
            errorData.Message || "Email o contraseña incorrectos."
          );
        } else if (response.status === 401) {
          throw new Error("Credenciales inválidas.");
        } else {
          throw new Error(
            `Error al iniciar sesión (Código: ${response.status})`
          );
        }
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.AccessToken);
      localStorage.setItem("refreshToken", data.RefreshToken);

      const userData = {
        id: data.UserId || 1,
        email: email,
        tipoUsuario: data.TipoUsuario || "cliente",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      onLoginSuccess(userData);

      setError({
        title: "Bienvenido",
        message: "Inicio de sesión exitoso. ¡Bienvenido de vuelta!",
      });
    } catch (err) {
      let errorMessage = err.message;
      if (err.message.includes("Failed to fetch")) {
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión.";
      }
      setError({
        title: "Error de Inicio de Sesión",
        message: errorMessage,
        retry: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (error?.title === "Bienvenido") {
      setMenu("homepage");
    }
    setError(null);
  };

  const retrySubmit = () => {
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Lado izquierdo con logo y mensaje de bienvenida */}
          <div className="login-left">
            <button
              className="back-button"
              onClick={() => setMenu("mainpage")}
              type="button"
              aria-label="Volver"
            >
              <FaArrowLeft size={16} />
            </button>
            
            <img src={loginImage} alt="Telo Fundi" className="login-title-image" />
            
            <div className="login-welcome">
              <h2>¡Bienvenido de nuevo!</h2>
              <p>Inicia sesión para acceder a tu cuenta y descubrir los mejores servicios personalizados para ti.</p>
            </div>
            
            {/* Formas decorativas */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          
          {/* Lado derecho con formulario */}
          <div className="login-right-form">
            <div className="form-title">
              <h2>Iniciar Sesión</h2>
              <p>Completa los datos para acceder a tu cuenta</p>
            </div>

            <div className="input-box">
              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`form-control ${email ? "filled" : ""}`}
                disabled={loading}
              />
              <label>Correo Electrónico</label>
              <FaUser className="input-icon" />
            </div>

            <div className="password-wrapper">
              <div className="input-box password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyUp={handlePasswordKeyUp}
                  onBlur={handlePasswordBlur}
                  className={`form-control ${password ? "filled" : ""}`}
                  disabled={loading}
                />
                <label>Contraseña</label>
                <FaLock className="input-icon" />
                {isCapsLockOn && (
                  <div className="caps-tooltip">Bloq Mayús activado</div>
                )}
                <span 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="remember-me">
              <input 
                type="checkbox" 
                id="rememberMe" 
                checked={rememberMe} 
                onChange={handleRememberMeChange} 
              />
              <label htmlFor="rememberMe">Recordarme</label>
            </div>

            <div className="forgot-password">
              <button type="button" onClick={() => setMenu("recuperar")}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="registro-button-container">
              <button
                type="submit"
                id="confirm"
                className="registro-button"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>

            <div className="login-footer">
              ¿Aún no tienes cuenta?
              <button type="button" onClick={() => setMenu("registro")}>
                ¡Regístrate!
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="registro-modal">
            <div className="registro-modal-content">
              <h3>{error.title}</h3>
              <p>{error.message}</p>
              <div className="registro-modal-buttons">
                {error.retry && (
                  <button onClick={retrySubmit} className="registro-modal-button">
                    Reintentar
                  </button>
                )}
                <button onClick={closeModal} className="registro-modal-button">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;