import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

if (API_BASE_URL) {
  const cleanedUrl = API_BASE_URL.trim().replace(/\/+$/, '');
  if (!cleanedUrl.endsWith('/api')) {
    API_BASE_URL = `${cleanedUrl}/api`;
  } else {
    API_BASE_URL = cleanedUrl;
  }
}

const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor to attach JWT token for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const productService = {
  getProducts:    (params) => api.get('/products', { params }),
  getProductById: (id)     => api.get(`/products/${id}`),
  createProduct:  (data)   => api.post('/products', data),
  updateProduct:  (id, data) => api.put(`/products/${id}`, data),
  deleteProduct:  (id)     => api.delete(`/products/${id}`),
};

export const workService = {
  getWorkProjects:   (params) => api.get('/work', { params }),
  createWorkProject: (data)   => api.post('/work', data),
  updateWorkProject: (id, data) => api.put(`/work/${id}`, data),
  deleteWorkProject: (id)     => api.delete(`/work/${id}`),
};

export const journeyService = {
  getTimelineEvents:    ()         => api.get('/journey'),
  createTimelineEvent:  (data)     => api.post('/journey', data),
  updateTimelineEvent:  (id, data) => api.put(`/journey/${id}`, data),
  deleteTimelineEvent:  (id)       => api.delete(`/journey/${id}`),
};

export const inquiryService = {
  submitInquiry: (data) => api.post('/inquiries', data),
  getInquiries:  ()     => api.get('/inquiries'),
};

export const adminAuthService = {
  login: (credentials) => api.post('/admin/login', credentials),
  getMe: ()            => api.get('/admin/me'),
};

export const uploadService = {
  /** Upload one or more files. Returns { success, url, urls, public_id, public_ids } */
  uploadImages: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  /** Legacy single-file helper kept for backwards compat */
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
