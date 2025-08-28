import { Card } from "react-bootstrap";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <Card style={{ background: '#111', borderRadius: '18px', boxShadow: '0 0 32px rgba(0,0,0,0.18)', maxWidth: '400px', width: '100%' }}>
        <Card.Body style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <AlertCircle className="h-16 w-16" style={{ color: '#fff', marginBottom: '12px' }} />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>404</h1>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#eee', marginBottom: '0' }}>Page Not Found</h2>
          </div>
          <p style={{ marginTop: '12px', color: '#ccc', fontSize: '1rem' }}>
            Sorry, this page does not exist or is unavailable.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{ marginTop: '32px', background: '#fff', color: '#111', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
          >
            ← Back to Home
          </button>
        </Card.Body>
      </Card>
    </div>
  );
}
