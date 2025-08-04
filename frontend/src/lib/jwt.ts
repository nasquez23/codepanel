// JWT utility functions
export interface JwtPayload {
  sub: string; // user id
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  iat: number; // issued at
  exp: number; // expiration
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const getTokenExpiryTime = (token: string): number | null => {
  const payload = decodeJwt(token);
  return payload ? payload.exp * 1000 : null; // Convert to milliseconds
}; 