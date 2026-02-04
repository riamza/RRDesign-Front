import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './slices/servicesSlice';
import projectsReducer from './slices/projectsSlice';
import templatesReducer from './slices/templatesSlice';
import clientProjectsReducer from './slices/clientProjectsSlice';
import pricingReducer from './slices/pricingSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    projects: projectsReducer,
    templates: templatesReducer,
    clientProjects: clientProjectsReducer,
    pricing: pricingReducer,
    auth: authReducer,
    users: usersReducer,
  },
});
