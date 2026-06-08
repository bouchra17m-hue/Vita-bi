import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('VitaBi crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)', color: 'var(--on-surface)', padding: '2rem' }}>
          <div style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Oups, quelque chose s'est mal passé.</h1>
            <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
              Notre équipe a été notifiée. Vous pouvez réessayer ou revenir à l'accueil.
            </p>
            <pre style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'left', fontSize: '0.8rem', overflow: 'auto', marginBottom: '2rem' }}>
              {this.state.error?.message}
            </pre>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
            >
              Revenir à l'accueil
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
