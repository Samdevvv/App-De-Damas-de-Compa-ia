// AuthService.js - Servicio de autenticación para manejar tokens y sesiones

const API_BASE_URL = 'https://localhost:7134/api';

class AuthService {
  // Login del usuario
  static async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Email: email,
          Password: password,
          RememberMe: rememberMe
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.Message || `Error ${response.status}`);
      }
      
      const data = await response.json();
      
      // Guardar tokens
      localStorage.setItem('accessToken', data.AccessToken);
      localStorage.setItem('refreshToken', data.RefreshToken);
      
      // Obtener información del usuario
      const userInfo = await this.getUserInfo();
      
      return {
        success: true,
        userData: userInfo,
        tokens: {
          accessToken: data.AccessToken,
          refreshToken: data.RefreshToken
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Obtener información del usuario actual
  static async getUserInfo() {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No hay token de acceso');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener información del usuario (${response.status})`);
      }
      
      const userInfo = await response.json();
      
      // Guardar info de usuario en localStorage
      const userData = {
        id: userInfo.Id,
        email: userInfo.Email,
        tipoUsuario: userInfo.TipoUsuario,
        perfilCompleto: userInfo.PerfilCompleto || false,
        nombre: userInfo.Nombre || userInfo.NombrePerfil || '',
        perfilId: userInfo.PerfilId
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      return null;
    }
  }
  
  // Registro de usuario
  static async register(userData, userType) {
    try {
      let url;
      let payload;
      
      switch (userType) {
        case 'cliente':
          url = `${API_BASE_URL}/clientes/registro`;
          payload = {
            Email: userData.email.trim(),
            Password: userData.password.trim(),
            Nickname: userData.nickname ? userData.nickname.trim() : undefined
          };
          break;
        case 'acompanante':
          url = `${API_BASE_URL}/Acompanantes/registro`;
          payload = {
            Email: userData.email.trim(),
            Password: userData.password.trim(),
            NombrePerfil: userData.nombre.trim(),
            Genero: userData.genero?.value,
            Edad: parseInt(userData.edad),
            Ciudad: userData.ciudad ? userData.ciudad.trim() : undefined,
            Pais: userData.pais?.label,
            WhatsApp: userData.phone ? userData.phone.trim() : undefined
          };
          break;
        case 'agencia':
          url = `${API_BASE_URL}/Agencia/solicitar-registro`;
          payload = {
            Nombre: userData.nombreAgencia.trim(),
            Email: userData.email.trim(),
            Password: userData.password.trim(),
            Descripcion: userData.descripcion.trim(),
            Ciudad: userData.ciudad.trim(),
            Pais: userData.pais?.label,
            Direccion: userData.direccion.trim()
          };
          break;
        default:
          throw new Error('Tipo de usuario inválido');
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.Detail || errorData.Message || errorData.mensaje ||
          `Error al registrar (Código: ${response.status})`
        );
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data,
        userType: userType
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Auto-login después del registro
  static async autoLogin(email, password) {
    return await this.login(email, password, false);
  }
  
  // Actualizar perfil de usuario
  static async updateProfile(profileData, userType) {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No hay token de acceso');
      }
      
      let url;
      
      switch (userType) {
        case 'cliente':
          url = `${API_BASE_URL}/clientes/${profileData.id}`;
          break;
        case 'acompanante':
          url = `${API_BASE_URL}/Acompanantes/${profileData.id}`;
          break;
        case 'agencia':
          url = `${API_BASE_URL}/Agencia/${profileData.id}`;
          break;
        default:
          throw new Error('Tipo de usuario inválido');
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar perfil (${response.status})`);
      }
      
      // Actualizar información del usuario en localStorage
      await this.getUserInfo();
      
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Subir foto
  static async uploadPhoto(file, userId, userType) {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No hay token de acceso');
      }
      
      let url;
      
      switch (userType) {
        case 'cliente':
          url = `${API_BASE_URL}/clientes/${userId}/foto`;
          break;
        case 'acompanante':
          url = `${API_BASE_URL}/Acompanantes/${userId}/foto`;
          break;
        case 'agencia':
          url = `${API_BASE_URL}/Agencia/${userId}/logo`;
          break;
        default:
          throw new Error('Tipo de usuario inválido');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir foto (${response.status})`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error al subir foto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Cerrar sesión
  static logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
  
  // Verificar si el usuario está autenticado
  static isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }
  
  // Obtener usuario actual
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Renovar token
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No hay refresh token');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RefreshToken: refreshToken })
      });
      
      if (!response.ok) {
        throw new Error(`Error al renovar token (${response.status})`);
      }
      
      const data = await response.json();
      
      localStorage.setItem('accessToken', data.AccessToken);
      localStorage.setItem('refreshToken', data.RefreshToken);
      
      return true;
    } catch (error) {
      console.error('Error al renovar token:', error);
      // Si falla la renovación, forzar logout
      this.logout();
      return false;
    }
  }
}

export default AuthService;