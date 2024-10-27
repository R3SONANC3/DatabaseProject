import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // You'll need to install jwt-decode package

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwt_decode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          setUser(decoded);
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (token) => {
    try {
      const decoded = jwt_decode(token);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateToken = async (newToken) => {
    try {
      const decoded = jwt_decode(newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (error) {
      console.error('Failed to update token:', error);
      throw new Error('Invalid token');
    }
  };

  // Automatically handle token refresh
  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // If token is about to expire in the next 5 minutes
      if (timeUntilExpiry < 300000 && timeUntilExpiry > 0) {
        // Implement your token refresh logic here
        // This is just an example - adjust according to your backend implementation
        const refreshToken = async () => {
          try {
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              const { token: newToken } = await response.json();
              await updateToken(newToken);
            }
          } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
          }
        };

        refreshToken();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAdmin,
      updateToken
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example of decoded JWT structure
const exampleJWT = {
  // Header (not decoded)
  // {
  //   "alg": "HS256",
  //   "typ": "JWT"
  // }

  // Payload (decoded)
  // {
  //   "sub": "1234567890",
  //   "name": "John Doe",
  //   "email": "john@example.com",
  //   "role": "admin",
  //   "iat": 1516239022,
  //   "exp": 1516239022
  // }

  // Signature (not decoded)
  // HMACSHA256(
  //   base64UrlEncode(header) + "." +
  //   base64UrlEncode(payload),
  //   secret
  // )
};

export default AuthContext;