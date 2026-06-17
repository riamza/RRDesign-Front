const AT = 'rr_at';
const RT = 'rr_rt';
const ROLE = 'rr_role';
const DAYS = 30;

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = window.location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Strict${secure}`;
}

function getCookie(name) {
  const prefix = `${name}=`;
  for (const part of document.cookie.split(';')) {
    const c = part.trim();
    if (c.startsWith(prefix)) return decodeURIComponent(c.slice(prefix.length));
  }
  return null;
}

function deleteCookie(name) {
  const secure = window.location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict${secure}`;
}

export const tokenStorage = {
  setAccessToken(t)  { setCookie(AT, t, DAYS); },
  getAccessToken()   { return getCookie(AT); },
  clearAccessToken() { deleteCookie(AT); },

  setRefreshToken(t)  { setCookie(RT, t, DAYS); },
  getRefreshToken()   { return getCookie(RT); },
  clearRefreshToken() { deleteCookie(RT); },

  setRole(r)   { setCookie(ROLE, r, DAYS); },
  getRole()    { return getCookie(ROLE); },
  clearRole()  { deleteCookie(ROLE); },

  setTokens(accessToken, refreshToken, role) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setRole(role);
  },

  clearAll() {
    this.clearAccessToken();
    this.clearRefreshToken();
    this.clearRole();
  },

  hasSession() {
    return !!this.getAccessToken();
  },

};

// Migrare one-time din localStorage → cookies, rulează sincron la primul import
// (ES module cache garantează că se execută o singură dată per page load)
(function migrateOnce() {
  try {
    const oldAt   = localStorage.getItem('access_token');
    const oldRt   = localStorage.getItem('refresh_token');
    const oldRole = localStorage.getItem('user_role');

    if ((oldAt || oldRt) && !getCookie(AT) && !getCookie(RT)) {
      if (oldAt)   tokenStorage.setAccessToken(oldAt);
      if (oldRt)   tokenStorage.setRefreshToken(oldRt);
      if (oldRole) tokenStorage.setRole(oldRole);
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  } catch (_) {
    // Ignoră erori de acces la storage (e.g. iframe sandboxed)
  }
}());
