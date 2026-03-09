import React from 'react';
import { logger } from '../../services/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.log('ReactUI', 'ComponentCrash', error.message, false, errorInfo.componentStack);
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Ceva nu a func?ionat corect în interfa?a.</h2>
          <p>Te rugam sa reîncarci pagina sau sa revii mai târziu.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '8px' }}
          >
            Reîncarca
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
