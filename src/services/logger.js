const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5247/api';

export const logger = {
  log: async (component, action, message, isSuccess = true, stackTrace = null) => {
    try {
      if (!isSuccess) {
         console.error(`[${component}] ${action}: ${message} \n${stackTrace || ""}`);
      } else {
         console.log(`[${component}] ${action}: ${message}`);
      }
      
      const token = localStorage.getItem('access_token');
      await fetch(`${API_URL}/Logs/frontend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          component,
          action,
          message: message?.toString() || 'Unknown log',
          isSuccess,
          stackTrace: stackTrace?.toString() || null
        })
      });
    } catch (e) {
      // Ignore inner logging failures to prevent infinite loops globally
      console.warn("Global logger failed to send telemetry", e);
    }
  }
};
