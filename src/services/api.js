const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Function to handle token refresh
const refreshTokenFlow = async () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (!accessToken || !refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/Auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user_role', data.role);
        return data.accessToken;
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        return null;
    }
  } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      return null;
  }
};

const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  let config = {
    method: options.method || 'GET',
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    let response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
        // If we are already calling login or refresh, don't retry loop
        if (endpoint.includes('/Auth/login') || endpoint.includes('/Auth/refresh-token')) {
            const errorText = await response.text();
            throw new Error(errorText || 'Authentication failed');
        }

        const newToken = await refreshTokenFlow();
        if (newToken) {
            // Retry request with new token
            config.headers['Authorization'] = `Bearer ${newToken}`;
             response = await fetch(url, config);
        } else {
             // Refresh failed - let the caller handle it or redirect
             // window.location.href = '/login'; // Optional: Redirect here
             throw new Error('Session expired');
        }
    }

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const api = {
  auth: {
      login: (email, password) => request('/Auth/login', { method: 'POST', body: { email, password } }),
      getProfile: () => request('/Auth/me'),
      changePassword: (data) => request('/Auth/change-password', { method: 'POST', body: data }),
      // Invitation
      inviteUser: (email) => request('/Auth/invite', { method: 'POST', body: { email } }),
      validateInvitation: (token) => request(`/Auth/validate-invitation?token=${token}`),
      completeRegistration: (data) => request('/Auth/complete-registration', { method: 'POST', body: data }),
  },
  // Services
  getServices: async () => {
    const data = await request('/services');
    return Array.isArray(data) ? data : [];
  },
  getService: (id) => request(`/services/${id}`),
  createService: (service) => request('/services', { method: 'POST', body: service }),
  updateService: (id, service) => request(`/services/${id}`, { method: 'PUT', body: service }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Client Projects (Admin Dashboard)
  getClientProjects: async () => {
    const data = await request('/ClientProjects');
    return Array.isArray(data) ? data : [];
  },
  getClientProjectsByUser: async (userId) => {
    const data = await request(`/ClientProjects/user/${userId}`);
    return Array.isArray(data) ? data : [];
  },
  getClientProject: (id) => request(`/ClientProjects/${id}`),
  createClientProject: (project) => request('/ClientProjects', { method: 'POST', body: project }),
  updateClientProject: (id, project) => request(`/ClientProjects/${id}`, { method: 'PUT', body: project }), // Only fields
  deleteClientProject: (id) => request(`/ClientProjects/${id}`, { method: 'DELETE' }),
  markClientProjectFinished: (id) => request(`/ClientProjects/${id}/finish`, { method: 'POST' }),
  addClientProjectRequirement: (id, data) => request(`/ClientProjects/${id}/requirements`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      // { description: string, estimatedDurationDays: number }
      body: JSON.stringify(data) 
  }),
  updateClientProjectRequirement: (reqId, updateDto) => request(`/ClientProjects/requirements/${reqId}/update`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      // { status: number, description?:string, estimatedDurationDays?:number }
      body: JSON.stringify(updateDto) 
  }),
  deleteClientProjectRequirement: (reqId) => request(`/ClientProjects/requirements/${reqId}`, { method: 'DELETE' }),

  // Portfolio Projects
  getProjects: async () => {
    const data = await request('/projects');
    if (!Array.isArray(data)) return [];
    return data.map(project => ({
      ...project,
      technologies: project.technologies ? project.technologies.split(',').map(t => t.trim()) : [],
      image: project.imageUrl,
      link: project.link
    }));
  },
  getProject: async (id) => {
    const data = await request(`/projects/${id}`);
    return {
      ...data,
      technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()) : [],
      image: data.imageUrl
    };
  },
  createProject: (project) => {
    const dto = {
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(',') : project.technologies,
      imageUrl: project.image,
      link: project.link
    };
    return request('/projects', { method: 'POST', body: dto });
  },
  updateProject: (id, project) => {
    const dto = {
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(',') : project.technologies,
      imageUrl: project.image,
      link: project.link
    };
    return request(`/projects/${id}`, { method: 'PUT', body: dto });
  },
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Templates
  getTemplates: async () => {
    const data = await request('/templates');
    if (!Array.isArray(data)) return [];
    return data.map(template => ({
      ...template,
      image: template.imageUrl,
      demoLink: template.previewLink,
      technologies: [], 
      features: []
    }));
  },
  getTemplate: async (id) => {
    const data = await request(`/templates/${id}`);
    return {
      ...data,
      image: data.imageUrl,
      demoLink: data.previewLink,
      technologies: [],
      features: []
    };
  },
  createTemplate: (template) => {
    const dto = {
      ...template,
      imageUrl: template.image,
      previewLink: template.demoLink,
      price: parseFloat(template.price) || 0,
      isFree: template.isFree || false
    };
    return request('/templates', { method: 'POST', body: dto });
  },
  updateTemplate: (id, template) => {
    const dto = {
      ...template,
      imageUrl: template.image,
      previewLink: template.demoLink,
      price: parseFloat(template.price) || 0,
      isFree: template.isFree || false
    };
    return request(`/templates/${id}`, { method: 'PUT', body: dto });
  },
  deleteTemplate: (id) => request(`/templates/${id}`, { method: 'DELETE' }),
};
